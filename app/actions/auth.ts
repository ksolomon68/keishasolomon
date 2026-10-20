"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { burnPasswordCheck, hashPassword, verifyPassword } from "@/lib/auth/password";
import { clearFailures, isLocked, recordFailure } from "@/lib/auth/rate-limit";
import { revalidatePath } from "next/cache";
import { createSession, destroySession, isStarter, requireUser } from "@/lib/auth/session";
import { getStore, isEmailTaken } from "@/lib/store";
import { sendPasswordResetEmail } from "@/lib/email";
import { site } from "@/data/cohortData";
import {
  fieldErrors,
  forgotPasswordSchema,
  joinCohortSchema,
  resetPasswordSchema,
  loginSchema,
  registerSchema,
  starterRegisterSchema,
  textValues,
  type FormState,
} from "@/lib/validation";

/** Never echo secrets back into the form. */
const safeValues = (formData: FormData) => {
  const values = textValues(formData);
  delete values.password;
  delete values.accessCode;
  return values;
};

/** Only same-site relative paths are honored after login (prevents open redirects). */
function safeNext(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && /^\/(?![/\\])/.test(value) ? value : null;
}

const clientIp = async () => (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = safeValues(formData);
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  // With one code per cohort the code is what routes a person into a roster, so guessing it is worth blunting.
  const limitKey = `register|${await clientIp()}`;
  if (isLocked(limitKey)) {
    return { message: "Too many attempts. Please wait 15 minutes and try again.", values };
  }

  const store = await getStore();
  const cohort = await store.findCohortByAccessCode(parsed.data.accessCode);
  if (!cohort) {
    recordFailure(limitKey);
    return { errors: { accessCode: ["That access code isn't valid."] }, values };
  }
  if (cohort.archived) {
    return { message: "Registration for this cohort has closed. Please contact your instructor.", values };
  }

  try {
    const user = await store.createUser({
      email: parsed.data.email,
      name: parsed.data.name,
      organization: parsed.data.organization,
      role: "participant",
      cohortId: cohort.id,
      passwordHash: await hashPassword(parsed.data.password),
    });
    await createSession(user.id);
  } catch (error) {
    if (isEmailTaken(error)) {
      return { errors: { email: ["An account with that email already exists. Try signing in."] }, values };
    }
    throw error;
  }
  redirect("/onboarding");
}

/** Free Starter plan: no access code, no cohort. The member can join a cohort later with a code. */
export async function registerStarterAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = safeValues(formData);
  const parsed = starterRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const limitKey = `starter|${await clientIp()}`;
  if (isLocked(limitKey)) {
    return { message: "Too many attempts. Please wait 15 minutes and try again.", values };
  }

  try {
    const user = await (await getStore()).createUser({
      email: parsed.data.email,
      name: parsed.data.name,
      organization: parsed.data.organization,
      role: "participant",
      cohortId: null,
      passwordHash: await hashPassword(parsed.data.password),
    });
    await createSession(user.id);
  } catch (error) {
    if (isEmailTaken(error)) {
      // Count these so the form can't be used to enumerate registered emails quickly.
      recordFailure(limitKey);
      return { errors: { email: ["An account with that email already exists. Try signing in."] }, values };
    }
    throw error;
  }
  redirect("/dashboard");
}

/** Moves a Starter member into the cohort their access code belongs to. Their problem log comes with them. */
export async function joinCohortAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/dashboard");
  if (!isStarter(user)) return { message: "Your account is already part of a cohort." };
  const parsed = joinCohortSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const limitKey = `register|${await clientIp()}`;
  if (isLocked(limitKey)) return { message: "Too many attempts. Please wait 15 minutes and try again." };

  const store = await getStore();
  const cohort = await store.findCohortByAccessCode(parsed.data.accessCode);
  if (!cohort) {
    recordFailure(limitKey);
    return { errors: { accessCode: ["That access code isn't valid."] } };
  }
  if (cohort.archived) return { message: "Registration for this cohort has closed. Please contact your instructor." };

  await store.updateUser(user.id, { cohortId: cohort.id });
  revalidatePath("/dashboard");
  redirect("/onboarding");
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const next = safeNext(formData.get("next"));
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: safeValues(formData) };

  const { email, password } = parsed.data;
  const limitKey = `${await clientIp()}|${email}`;
  if (isLocked(limitKey)) {
    return { message: "Too many attempts. Please wait 15 minutes and try again.", values: { email } };
  }

  const user = await (await getStore()).findUserByEmail(email);
  const valid = user ? await verifyPassword(password, user.passwordHash) : (await burnPasswordCheck(password), false);
  if (!user || !valid) {
    recordFailure(limitKey);
    return { message: "That email and password don't match.", values: { email } };
  }

  clearFailures(limitKey);
  await createSession(user.id);
  redirect(next ?? (user.role === "admin" ? "/admin" : "/dashboard"));
}

/* ---------- Password reset ---------- */

const RESET_MINUTES = 60;
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** The same reply whether or not the email has an account, so the form can't be used to discover accounts. */
const RESET_REQUESTED =
  "If an account uses that email, a reset link is on its way. It expires in 60 minutes. Check your spam folder if it doesn't arrive.";

export async function requestPasswordResetAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = textValues(formData);
  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  // Every request counts, so one connection or one address can't flood an inbox.
  const ipKey = `reset|${await clientIp()}`;
  const emailKey = `reset|${parsed.data.email}`;
  if (isLocked(ipKey) || isLocked(emailKey)) {
    return { message: "Too many reset requests. Please wait 15 minutes and try again.", values };
  }
  recordFailure(ipKey);
  recordFailure(emailKey);

  const store = await getStore();
  const user = await store.findUserByEmail(parsed.data.email);
  if (user) {
    const token = randomBytes(32).toString("base64url");
    await store.createPasswordReset(user.id, hashToken(token), new Date(Date.now() + RESET_MINUTES * 60_000).toISOString());
    // Links always use the configured public URL, never the request's Host header.
    const path = `/reset-password?token=${token}`;
    after(async () => {
      const result = await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl: `${site.url}${path}`, expiresInMinutes: RESET_MINUTES });
      if (!result.sent) {
        if (process.env.NODE_ENV !== "production") console.info(`[Password reset] Email not sent (${result.error}). Local link: ${path}`);
        else console.error(`[Password reset] Email to user ${user.id} not sent: ${result.error}`);
      }
    });
  }
  return { ok: true, message: RESET_REQUESTED };
}

export async function resetPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    return errors.token ? { message: errors.token[0] } : { errors };
  }
  const store = await getStore();
  const userId = await store.consumePasswordReset(hashToken(parsed.data.token));
  if (!userId) return { message: "This reset link has expired or was already used. Request a new one." };
  const user = await store.updateUser(userId, { passwordHash: await hashPassword(parsed.data.password) });
  if (!user) return { message: "This reset link has expired or was already used. Request a new one." };
  clearFailures(`reset|${user.email}`);
  await createSession(user.id);
  redirect(user.role === "admin" ? "/admin" : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
