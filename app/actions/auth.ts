"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { burnPasswordCheck, hashPassword, verifyPassword } from "@/lib/auth/password";
import { clearFailures, isLocked, recordFailure } from "@/lib/auth/rate-limit";
import { createSession, destroySession } from "@/lib/auth/session";
import { EmailTakenError, getStore } from "@/lib/store";
import { fieldErrors, loginSchema, registerSchema, textValues, type FormState } from "@/lib/validation";

/** Never echo secrets back into the form. */
const safeValues = (formData: FormData) => {
  const values = textValues(formData);
  delete values.password;
  delete values.accessCode;
  return values;
};

/** Only same-site relative paths are honoured after login (prevents open redirects). */
function safeNext(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && /^\/(?![/\\])/.test(value) ? value : null;
}

const digest = (value: string) => createHash("sha256").update(value).digest();

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = safeValues(formData);
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const expected = process.env.COHORT_ACCESS_CODE;
  if (!expected) {
    return { message: "Registration isn't open yet. Please contact your instructor.", values };
  }
  if (!timingSafeEqual(digest(parsed.data.accessCode), digest(expected))) {
    return { errors: { accessCode: ["That access code isn't valid."] }, values };
  }

  try {
    const user = await (await getStore()).createUser({
      email: parsed.data.email,
      name: parsed.data.name,
      organization: parsed.data.organization,
      role: "participant",
      passwordHash: await hashPassword(parsed.data.password),
    });
    await createSession(user.id);
  } catch (error) {
    if (error instanceof EmailTakenError) {
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
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limitKey = `${ip}|${email}`;
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
