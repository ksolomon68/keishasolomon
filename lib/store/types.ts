import type {
  DeliverableStatus,
  FrictionFrequency,
  ResourceKind,
} from "@/data/cohortData";

export type Role = "participant" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: Role;
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

export type NewUser = Pick<User, "email" | "name" | "organization" | "role"> & {
  passwordHash: string;
};

export type NewFriction = Pick<FrictionEntry, "task" | "frequency" | "minutes" | "sessionId">;

export type DeliverablePatch = Partial<Pick<Deliverable, "status" | "linkUrl" | "notes" | "fileId">>;

export type NewResource = Pick<Resource, "sessionId" | "title" | "kind" | "linkUrl" | "fileId" | "createdBy">;

export type NewFile = Pick<StoredFile, "ownerId" | "originalName" | "storedName" | "mime" | "size">;

/**
 * Persistence contract. Two implementations exist: MySQL (production) and a JSON file (local dev).
 * Every method that takes a `userId` scopes its query to that user; callers must still authorize.
 */
export interface Store {
  createUser(input: NewUser): Promise<User>;
  findUserByEmail(email: string): Promise<UserWithHash | null>;
  findUserById(id: string): Promise<User | null>;
  listUsers(): Promise<User[]>;

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

  listResources(): Promise<Resource[]>;
  createResource(input: NewResource): Promise<Resource>;
  deleteResource(id: string): Promise<Resource | null>;

  createFile(input: NewFile): Promise<StoredFile>;
  getFile(id: string): Promise<StoredFile | null>;
  deleteFile(id: string): Promise<StoredFile | null>;
}
