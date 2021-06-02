const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/network"
);

// const db = "postgres:postgres:postgres@localhost:5432/network";

//------------------ users-database-------------------------

module.exports.addUser = (first, last, email, hashed_password) => {
    const q = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [first, last, email, hashed_password];
    return db.query(q, params);
};

module.exports.getHashedPassword = (email) => {
    const q = `SELECT password, id FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserByEmail = (email) => {
    const q = `SELECT email FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.setSecretCode = (email, code) => {
    const q = `INSERT INTO reset_codes (email, code) VALUES ($1, $2)`;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.getSecretCode = (email) => {
    const q = `SELECT code FROM reset_codes WHERE email = $1 AND CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`;
    const params = [email];
    return db.query(q, params);
};

module.exports.updateUserPassword = (email, password) => {
    const q = `UPDATE users SET password = $2 WHERE email = $1`;
    const params = [email, password];
    return db.query(q, params);
};

module.exports.getUserData = (id) => {
    const q = `SELECT * FROM users WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.uploadImage = (imageUrl, userId) => {
    const q = `UPDATE users SET image = $1 WHERE id = $2 RETURNING *`;
    const params = [imageUrl, userId];
    return db.query(q, params);
};

module.exports.updateBio = (bio, userId) => {
    const q = `UPDATE users SET bio = $1 WHERE id = $2 RETURNING *`;
    const params = [bio, userId];
    return db.query(q, params);
};

module.exports.getLatestUsers = () => {
    const q = `SELECT * FROM users ORDER BY id DESC LIMIT 3`;
    return db.query(q);
};

module.exports.searchForUsers = (input) => {
    return db.query(`SELECT * FROM users WHERE first ILIKE $1 LIMIT 10;`, [
        input + "%",
    ]);
};

module.exports.addWallPost = (id, url, description) => {
    return db.query(
        `INSERT INTO user_wall (user_id, url, description)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, url, description, created_at`,
        [id, url, description]
    );
};

module.exports.addWallComment = (id, commentId, comment) => {
    return db.query(
        `INSERT INTO wall_comments (user_id, url, description)
        VALUES ($1, $2, $3)`,
        [id, commentId, comment]
    );
};

module.exports.getWallPost = (id) => {
    return db.query(
        `SELECT * FROM user_wall
        WHERE user_id = $1
        ORDER BY id DESC`,
        [id]
    );
};

module.exports.getWallComment = (id) => {
    return db.query(
        `SELECT * FROM wall_comments
        WHERE post_id = $1`,
        [id]
    );
};

//------------- friendship-database-------------------------

module.exports.getFriendshipStatus = (userId, otherUserId) => {
    return db.query(
        `SELECT * FROM friendships WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1);`,
        [userId, otherUserId]
    );
};

module.exports.acceptFriendRequest = (userId, otherUserId) => {
    return db.query(
        `UPDATE friendships SET accepted = true WHERE sender_id = $2 AND recipient_id =$1 RETURNING sender_id, recipient_id, accepted;`,
        [userId, otherUserId]
    );
};

module.exports.sendFriendRequest = (userId, otherUserId) => {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2) RETURNING  sender_id, recipient_id, accepted;`,
        [userId, otherUserId]
    );
};

module.exports.deleteFriendship = (userId, otherUserId) => {
    return db.query(
        `DELETE FROM friendships WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1);`,
        [userId, otherUserId]
    );
};

// module.exports.cancelFriendshipRequest = (userId, otherUserId) => {
//     return db.query(
//         `DELETE FROM friendships WHERE sender_id = $1 AND recipient_id = $2;`,
//         [userId, otherUserId]
//     );
// };

//  -------- friends and wannabees

module.exports.getFriendsWannabees = (userId) => {
    return db.query(
        `SELECT users.id, first, last, image, accepted
         FROM friendships
         JOIN users
         ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
         OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
         OR (accepted = true AND sender_id = $1 AND recipient_id = users.id);`,
        [userId]
    );
};

// --------- chatroom --------

module.exports.getLastTenMessages = () => {
    return db.query(
        `SELECT first, last, image, message_id, message, users.id, to_char(chat.created_at, 'YYYY Mon DD HH24:MI') as created_at
        FROM users
        JOIN chat
        ON (sender_id = users.id)
        ORDER BY message_id DESC
        LIMIT 10`
    );
};

module.exports.newChatMessage = (message, id) => {
    return db.query(
        `INSERT INTO chat (message, sender_id) VALUES( $1, $2) RETURNING message_id`,
        [message, id]
    );
};

module.exports.getLastChatMessage = (id) => {
    return db.query(
        `SELECT message_id, message, sender_id, to_char(chat.created_at, 'YYYY Mon DD HH24:MI') as created_at, users.first, users.last, users.image 
         FROM chat LEFT JOIN users ON sender_id = users.id 
         WHERE message_id = $1`,
        [id]
    );
};

// ----------------  private chat ------------------------

module.exports.getPrivateChat = (ownId, otherId) => {
    return db.query(
        `SELECT users.id AS user, first, last, image, message, private_messages.created_at, private_messages.id FROM private_messages
        LEFT JOIN users ON private_messages.sender_id = users.id
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)
        ORDER BY private_messages.id DESC LIMIT 50`,
        [ownId, otherId]
    );
};

module.exports.addPrivateMessage = (sender, recipient, msg) => {
    return db.query(
        `INSERT INTO private_messages (sender_id, recipient_id, message)
        VALUES ($1, $2, $3)
        RETURNING id`,
        [sender, recipient, msg]
    );
};

module.exports.getNewPrivateMessage = (messageId) => {
    return db.query(
        `SELECT users.id AS user, first, last, image, message, private_messages.created_at, private_messages.id FROM private_messages
        LEFT JOIN users ON private_messages.sender_id = users.id
        WHERE private_messages.id = $1`,
        [messageId]
    );
};

// ------ online users ------

// module.exports.getOnlineUser = (userId) => {
//     console.log("getOnlineUser db");
//     return db.query(
//         `SELECT id, first, last, image FROM users WHERE id = any($1)`,
//     [userId]
//     );
// };
