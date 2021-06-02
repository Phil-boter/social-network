DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
    message_id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sender_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

INSERT INTO chat (message, sender_id)
VALUES
('Hey there! How are you?', 35),
('I am fine. Thanks for asking!', 99),
('How is coding going', 200); 