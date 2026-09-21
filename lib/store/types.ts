import type {
  DeliverableStatus,
  FrictionFrequency,
  ResourceKind,
} from "@/data/cohortData";

export type Role = "participant" | "admin";

/**
 * Cohort every pre-existing participant and resource is moved into when the multi-cohort schema is
 * first applied. A fixed id keeps the JSON dev store and MySQL migration in agreement.
 */
export const DEFAULT_COHORT_ID = "00000000-0000-4000-8000-000000000001";

/**
 * One run of the programme. Each cohort has its own roster, access code, calendar and resources;
 * the curriculum itself (sessions, deliverables, capstone) is shared and lives in `data/cohortData.ts`.
 */
export interface Cohort {
  id: string;
  name: string;
  /** Participants enter this on /register to join the cohort. Unique across cohorts, case-insensitive. */
  accessCode: string;
  /** Session id -> ISO date (YYYY-MM-DD) or null for "to be announced". Missing ids use the programme default. */
  sessionDates: Record<string, string | null>;
  /** Date printed on certificates (ISO). Falls back to the cohort's last session date. */
  completionDate: string | null;
  /** Archived cohorts stay readable for the instructor but no longer accept registrations. */
  archived: boolean;
  createdAt: string;
}

export type NewCohort = Pick<Cohort, "name" | "accessCode"> &
  Partial<Pick<Cohort, "sessionDates" | "completionDate">>;

export type CohortPatch = Partial<Pick<Cohort, "name" | "accessCode" | "sessionDates" | "completionDate" | "archived">>;

export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: Role;
  /** Null for instructors, who sit above every cohort. */
  cohortId: string | null;
  createdAt: string;
}

export interface UserWithHash extends User {
  passwordHash: string;
}

export interface FrictionEntry {
  id: string;
  userId: string;
  task: string;
  frequency: FrictionFrequency;
  /** Minutes lost each time the task occurs. */
  minutes: number;
  /** Session whose build lab should target this task, if any. */
  sessionId: string | null;
  done: boolean;
  createdAt: string;
}

export interface Deliverable {
  userId: string;
  sessionId: string;
  status: DeliverableStatus;
  linkUrl: string | null;
  notes: string;
  fileId: string | null;
  updatedAt: string;
  /** Increments on every saved change, including instructor decisions. */
  version: number;
  /** Increments only when the participant's evidence or notes change. */
  revision: number;
  feedback: string;
  feedbackRevision: number | null;
}

export interface CapstoneProgress {
  userId: string;
  stepId: string;
}

export interface Attendance {
  userId: string;
  sessionId: string;
}

export interface StoredFile {
  id: string;
  ownerId: string;
  originalName: string;
  storedName: string;
  mime: string;
  size: number;
  createdAt: string;
}

export interface Resource {
  id: string;
  /** Null means shared with every cohort. */
  cohortId: string | null;
  sessionId: string;
  title: string;
  kind: ResourceKind;
  linkUrl: string | null;
  fileId: string | null;
  createdBy: string;
  createdAt: string;
}

export class EmailTakenError extends Error {
  constructor() {
    super("An account with that email already exists.");
    this.name = "EmailTakenError";
  }
}

export class AccessCodeTakenError extends Error {
  constructor() {
    super("Another cohort already uses that access code.");
    this.name = "AccessCodeTakenError";
  }
}

/**
 * Match store errors by name rather than `instanceof`: the store is created once per process but
 * Next bundles server actions and pages in separate layers, each with its own copy of these classes.
 */
export const isEmailTaken = (error: unknown): boolean => error instanceof Error && error.name === "EmailTakenError";
export const isAccessCodeTaken = (error: unknown): boolean =>
  error instanceof Error && error.name === "AccessCodeTakenError";

export type NewUser = Pick<User, "email" | "name" | "organization" | "role" | "cohortId"> & {
  passwordHash: string;
};

export type NewFriction = Pick<FrictionEntry, "task" | "frequency" | "minutes" | "sessionId">;

export type DeliverablePatch = Partial<Pick<Deliverable, "status" | "linkUrl" | "notes" | "fileId" | "feedback">> & {
  expectedVersion: number;
};

export type NewResource = Pick<Resource, "cohortId" | "sessionId" | "title" | "kind" | "linkUrl" | "fileId" | "createdBy">;

export type NewFile = Pick<StoredFile, "ownerId" | "originalName" | "storedName" | "mime" | "size">;

/**
 * Persistence contract. Two implementations exist: MySQL (production) and a JSON file (local dev).
 * Every method that takes a `userId` scopes its query to that user; callers must still authorize.
 */
export interface Store {
  /** Newest first, so a freshly created cohort is the instructor's default selection. */
  listCohorts(): Promise<Cohort[]>;
  getCohort(id: string): Promise<Cohort | null>;
  /** Case-insensitive; the code alone decides which cohort a new participant joins. */
  findCohortByAccessCode(code: string): Promise<Cohort | null>;
  /** Throws AccessCodeTakenError when another cohort already has the code. */
  createCohort(input: NewCohort): Promise<Cohort>;
  updateCohort(id: string, patch: CohortPatch): Promise<Cohort | null>;

  createUser(input: NewUser): Promise<User>;
  findUserByEmail(email: string): Promise<UserWithHash | null>;
  findUserById(id: string): Promise<User | null>;
  /** Omit `cohortId` for everyone (instructors included). */
  listUsers(cohortId?: string): Promise<User[]>;

  listFriction(userId: string): Promise<FrictionEntry[]>;
  addFriction(userId: string, input: NewFriction): Promise<FrictionEntry>;
  setFrictionDone(userId: string, id: string, done: boolean): Promise<void>;
  deleteFriction(userId: string, id: string): Promise<void>;

  /** Omit `userId` to list every participant's deliverables (admin roster). */
  listDeliverables(userId?: string): Promise<Deliverable[]>;
  getDeliverable(userId: string, sessionId: string): Promise<Deliverable | null>;
  upsertDeliverable(userId: string, sessionId: string, patch: DeliverablePatch): Promise<Deliverable>;

  listCapstone(userId?: string): Promise<CapstoneProgress[]>;
  setCapstoneStep(userId: string, stepId: string, done: boolean): Promise<void>;

  listAttendance(): Promise<Attendance[]>;
  setAttendance(userId: string, sessionId: string, present: boolean): Promise<void>;

  /** With `cohortId`: that cohort's resources plus the ones shared with every cohort. Without: everything. */
  listResources(cohortId?: string): Promise<Resource[]>;
  createResource(input: NewResource): Promise<Resource>;
  deleteResource(id: string): Promise<Resource | null>;

  createFile(input: NewFile): Promise<StoredFile>;
  getFile(id: string): Promise<StoredFile | null>;
  deleteFile(id: string): Promise<StoredFile | null>;
}
