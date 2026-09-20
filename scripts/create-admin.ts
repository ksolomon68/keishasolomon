/**
 * Creates (or promotes) an instructor account.
 * Usage: npm run admin:create -- "Keisha Solomon" keisha@example.com
 * The password is read from ADMIN_PASSWORD (never from argv, so it stays out of shell history).
 */
import { hashPassword } from "../lib/auth/password";
import { getStore } from "../lib/store";
import { registerSchema } from "../lib/validation";

async function main() {
  const [name, email] = process.argv.slice(2);
  const password = process.env.ADMIN_PASSWORD;
  if (!name || !email || !password) {
    throw new Error('Usage: ADMIN_PASSWORD=... npm run admin:create -- "Full Name" email@example.com');
  }

  const parsed = registerSchema.safeParse({ name, email, password, accessCode: "-", organization: "EVOBRAND Concepts" });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n"));
  }

  const store = await getStore();
  if (await store.findUserByEmail(parsed.data.email)) {
    throw new Error(`An account for ${parsed.data.email} already exists.`);
  }
  const user = await store.createUser({
    email: parsed.data.email,
    name: parsed.data.name,
    organization: parsed.data.organization,
    role: "admin",
    passwordHash: await hashPassword(parsed.data.password),
  });
  console.log(`Created instructor ${user.name} <${user.email}>.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
