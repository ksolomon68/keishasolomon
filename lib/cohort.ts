import type { Cohort, Resource, Store, User } from "@/lib/store";

/** The participant's own cohort, or null for instructors (who sit above every cohort). */
export async function cohortOf(store: Store, user: Pick<User, "cohortId">): Promise<Cohort | null> {
  return user.cohortId ? store.getCohort(user.cohortId) : null;
}

/**
 * Resources a person may see: an instructor sees all; a participant sees their cohort's plus the ones
 * shared with everyone. A participant somehow without a cohort falls back to shared only, never to everything.
 */
export async function resourcesFor(store: Store, user: Pick<User, "role" | "cohortId">): Promise<Resource[]> {
  if (user.role === "admin") return store.listResources();
  if (user.cohortId) return store.listResources(user.cohortId);
  return (await store.listResources()).filter((r) => r.cohortId === null);
}
