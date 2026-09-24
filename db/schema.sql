-- The AI Executive Sandbox: MySQL 5.7+/8.x and MariaDB 10.3+ compatible.
-- Apply with: npm run db:migrate   (idempotent; safe to re-run)

-- One row per run of the programme. The curriculum is shared; each cohort owns its roster, access
-- code, calendar and resources. Archived cohorts stay readable but stop accepting registrations.
CREATE TABLE IF NOT EXISTS cohorts (
  id              CHAR(36)     NOT NULL,
  name            VARCHAR(120) NOT NULL,
  access_code     VARCHAR(64)  NOT NULL,
  session_dates   TEXT         NOT NULL,           -- JSON: {"s1": "2026-10-16", "s6": null, ...}
  completion_date DATE         NULL,
  archived        TINYINT(1)   NOT NULL DEFAULT 0,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cohorts_access_code (access_code)  -- utf8mb4_unicode_ci: codes are case-insensitive
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- users.cohort_id and resources.cohort_id are added to pre-existing databases by scripts/migrate.ts
-- (MySQL has no ADD COLUMN IF NOT EXISTS). Instructors have a NULL cohort; a NULL resource cohort
-- means "shared with every cohort".
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL,
  email         VARCHAR(190) NOT NULL,
  name          VARCHAR(120) NOT NULL,
  organization  VARCHAR(160) NOT NULL DEFAULT '',
  role          VARCHAR(16)  NOT NULL DEFAULT 'participant',
  cohort_id     CHAR(36)     NULL,
  password_hash VARCHAR(100) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_cohort (cohort_id),
  CONSTRAINT fk_users_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS files (
  id            CHAR(36)     NOT NULL,
  owner_id      CHAR(36)     NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name   VARCHAR(80)  NOT NULL,
  mime          VARCHAR(120) NOT NULL,
  size          INT UNSIGNED NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_files_owner (owner_id),
  CONSTRAINT fk_files_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS friction_entries (
  id          CHAR(36)     NOT NULL,
  user_id     CHAR(36)     NOT NULL,
  task        VARCHAR(500) NOT NULL,
  frequency   VARCHAR(16)  NOT NULL,
  minutes     SMALLINT UNSIGNED NOT NULL,
  session_id  VARCHAR(8)   NULL,
  done        TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_friction_user (user_id, created_at),
  CONSTRAINT fk_friction_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coaching_notes (
  id          CHAR(36)     NOT NULL,
  user_id     CHAR(36)     NOT NULL,
  topic       VARCHAR(160) NOT NULL,
  note        TEXT         NOT NULL,
  next_step   VARCHAR(500) NOT NULL DEFAULT '',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_coaching_notes_user (user_id, created_at),
  CONSTRAINT fk_coaching_notes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS deliverables (
  user_id     CHAR(36)     NOT NULL,
  session_id  VARCHAR(8)   NOT NULL,
  status      VARCHAR(16)  NOT NULL DEFAULT 'not_started',
  link_url    VARCHAR(2048) NULL,
  notes       TEXT         NOT NULL,
  file_id     CHAR(36)     NULL,
  version     INT UNSIGNED NOT NULL DEFAULT 0,
  revision    INT UNSIGNED NOT NULL DEFAULT 1,
  feedback    TEXT         NULL,
  feedback_revision INT UNSIGNED NULL,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, session_id),
  CONSTRAINT fk_deliverables_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_deliverables_file FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS capstone_progress (
  user_id  CHAR(36)    NOT NULL,
  step_id  VARCHAR(40) NOT NULL,
  done_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, step_id),
  CONSTRAINT fk_capstone_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendance (
  user_id    CHAR(36)   NOT NULL,
  session_id VARCHAR(8) NOT NULL,
  PRIMARY KEY (user_id, session_id),
  CONSTRAINT fk_attendance_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resources (
  id          CHAR(36)     NOT NULL,
  cohort_id   CHAR(36)     NULL,
  session_id  VARCHAR(8)   NOT NULL,
  title       VARCHAR(160) NOT NULL,
  kind        VARCHAR(24)  NOT NULL,
  link_url    VARCHAR(2048) NULL,
  file_id     CHAR(36)     NULL,
  created_by  CHAR(36)     NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_resources_session (session_id),
  KEY idx_resources_cohort (cohort_id),
  CONSTRAINT fk_resources_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts (id),
  CONSTRAINT fk_resources_file FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
