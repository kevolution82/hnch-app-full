CREATE TABLE IF NOT EXISTS app_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(255)
);

INSERT INTO app_user (username, password, email, role) VALUES ('admin', 'adminpass', 'admin@example.com', 'ADMIN');
INSERT INTO app_user (username, password, email, role) VALUES ('user1', 'userpass', 'user1@example.com', 'USER');