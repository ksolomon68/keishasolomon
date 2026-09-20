-- The AI Executive Sandbox: MySQL 5.7+/8.x and MariaDB 10.3+ compatible.
-- Apply with: npm run db:migrate   (idempotent; safe to re-run)

CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL,
  email         VARCHAR(190) NOT NULL,
  name          VARCHAR(120) NOT NULL,
  organization  VARCHAR(160) NOT NULL DEFAULT '',
  role          VARCHAR(16)  NOT NULL DEFAULT 'participant',
  password_hash VARCHAR(100) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
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
  session_id  VARCHAR(8)   NOT NULL,
  title       VARCHAR(160) NOT NULL,
  kind        VARCHAR(24)  NOT NULL,
  link_url    VARCHAR(2048) NULL,
  file_id     CHAR(36)     NULL,
  created_by  CHAR(36)     NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_resources_session (session_id),
  CONSTRAINT fk_resources_file FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
