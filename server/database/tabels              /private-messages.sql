DROP TABLE IF EXISTS private_messages;

CREATE TABLE private_messages (
   id SERIAL PRIMARY KEY,
   sender_id INT REFERENCES users(id) ON DELETE SET NULL,
   recipient_id INT REFERENCES users(id) ON DELETE SET NULL,
   message VARCHAR NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);