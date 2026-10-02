CREATE TABLE IF NOT EXISTS tool_results (
  user_id CHAR(36) NOT NULL,
  session_id VARCHAR(8) NOT NULL,
  data MEDIUMTEXT NOT NULL,
  version INT UNSIGNED NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, session_id),
  CONSTRAINT fk_tool_results_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
