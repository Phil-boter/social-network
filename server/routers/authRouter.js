const express = require("express");
const router = express.Router();

const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("../utils/ses");
const { hash, compare } = require("../utils/bc");
const db = require("../database/db");

router.post("/registration", (req, res) => {
    // console.log("req.body /register: ", req.body.first);
    // console.log("req.session /register: ", req.session);
    const { first, last, email, password } = req.body;

    hash(password)
        .then((hashed_password) => {
            db.addUser(first, last, email, hashed_password)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    res.json({ success: true });
                })
                .catch((error) => {
                    console.log("error registration", error);
                    // res.redirect("/registration");
                    res.json({ success: false });
                });
        })
        .catch((error) => {
            console.log("error registration", error);
            // res.redirect("/registration");
            res.json({ success: false });
        });
});

router.post("/login", (req, res) => {
    if (req.body.email == "") {
        res.json({ success: false });
    } else if (req.body.password == "") {
        res.json({ success: false });
    } else if (req.body.password != "") {
        let email = req.body.email;
        db.getHashedPassword(email)
            .then(({ rows }) => {
                let userId = rows[0].id;
                compare(req.body.password, rows[0].password)
                    .then((result) => {
                        if (result) {
                            req.session.userId = userId;
                            res.json({ success: true });
                        } else {
                            console.log("error in compare getHashedPassword");
                            res.json({ success: false });
                        }
                    })
                    .catch((error) => {
                        console.log("error match", error);
                        res.json({ success: false });
                    });
            })
            .catch((error) => {
                console.log("error match", error);
                res.json({ success: false });
            });
    } else {
        console.log("error in logIn post");
        res.json({ success: false });
    }
});

router.get("/logout", (req, res) => {
    console.log("userId logout before", req.session.userId);
    req.session = null;
    console.log("userId logout after", req.session);
    res.redirect("/welcome");
});

router.post("/password/reset/start", (req, res) => {
    console.log("post reset/start");
    console.log("email", req.body);
    db.getUserByEmail(req.body.email)
        .then(({ rows }) => {
            const secretCode = cryptoRandomString({
                length: 6,
            });
            db.setSecretCode(rows[0].email, secretCode)
                .then(() => {
                    sendEmail(
                        rows[0].email,
                        secretCode,
                        "This is your Code to reset your password. This code expires in 10 minutes!"
                    )
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((error) => {
                            console.log("error sendEmail", error);
                            res.json({ success: false });
                        });
                })
                .catch((error) => {
                    console.log("error setSecretCode", error);
                    res.json({ success: false });
                });
        })
        .catch((error) => {
            console.log("error getUserByEmail", error);
            res.json({ success: false });
        });
});

router.post("/password/reset/verify", (req, res) => {
    console.log("post reset/verify");
    console.log("email", req.body);
    const { code, password, email } = req.body;
    if (!password || !email) {
        res.json({ success: false });
    }
    console.log(code, password, email);
    hash(password).then((hashed_password) => {
        db.getSecretCode(email)
            .then(({ rows }) => {
                console.log("rows in getSecretCode", rows);
                if (rows[0].code === code) {
                    db.updateUserPassword(email, hashed_password)
                        .then(() => {
                            console.log("success in getSecretCode");
                            res.json({ success: true });
                        })
                        .catch((error) => {
                            console.log("error in updateUserPassword", error);
                            res.json({ success: false });
                        });
                } else {
                    console.log("error in if updateUserPassword");
                    res.json({ success: false });
                }
            })
            .catch((error) => {
                console.log("error in getSecretCode", error);
                res.json({ success: false });
            });
    });
});

module.exports = router;
