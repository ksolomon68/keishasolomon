"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { burnPasswordCheck, hashPassword, verifyPassword } from "@/lib/auth/password";
import { clearFailures, isLocked, recordFailure } from "@/lib/auth/rate-limit";
import { createSession, destroySession } from "@/lib/auth/session";
import { getStore, isEmailTaken } from "@/lib/store";
import { fieldErrors, loginSchema, registerSchema, textValues, type FormState } from "@/lib/validation";

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

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
