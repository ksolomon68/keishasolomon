import bcrypt from "bcryptjs";

const COST = 12;

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, COST);

export const verifyPassword = (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);

let dummyHash: Promise<string> | undefined;

/**
 * Compare against a throwaway hash when the email is unknown, so response time
 * doesn't reveal whether an account exists.
 */
export async function burnPasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword(crypto.randomUUID());
  await verifyPassword(password, await dummyHash);
}
