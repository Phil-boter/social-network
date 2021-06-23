const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.get("/latestUsers", (req, res) => {
    console.log("get reqest latestUser");
    db.getLatestUsers()
        .then(({ rows }) => {
            res.json({
                success: true,
                latestUsers: rows,
            });
        })
        .catch((error) => {
            console.log("error in getLatestUsers", error);
            res.json({ success: false });
        });
});

router.get("/searchForUsers/:input", (req, res) => {
    console.log("get request searechForUSers");
    // console.log("req.params :", req.params);
    let input = req.params.input;
    db.searchForUsers(input)
        .then(({ rows }) => {
            res.json({
                success: true,
                searchResult: rows,
            });
        })
        .catch((error) => {
            console.log("error in searchForUsers", error);
            res.json({ success: false });
        });
});

router.get("/friendshipStatus/:otherUserId", (req, res) => {
    console.log("get request friendshipStatus");
    let otherUserId = req.params.otherUserId;
    let userId = req.session.userId;
    db.getFriendshipStatus(userId, otherUserId)
        .then(({ rows }) => {
            res.json({
                friendshipStatus: rows,
                userId: userId,
                success: true,
            });
        })
        .catch((error) => {
            console.log("error in friendshipStatus", error);
            res.json({ success: false });
        });
});

router.post("/sendFriendRequest/:otherUserId", (req, res) => {
    console.log("post sendFriendRequest");
    let otherUserId = req.params.otherUserId;
    let userId = req.session.userId;
    db.sendFriendRequest(userId, otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            console.log("error in sendFriendRequest", error);
            res.json({ success: false });
        });
});

router.post("/acceptFriendRequest/:otherUserId", (req, res) => {
    console.log("post acceptDriendRequest");
    let otherUserId = req.params.otherUserId;
    let userId = req.session.userId;
    db.acceptFriendRequest(userId, otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            console.log("error in acceptDriendRequest", error);
            res.json({ success: false });
        });
});

router.post("/deleteFriendship/:otherUserId", (req, res) => {
    console.log("post deleteFriendship");
    let otherUserId = req.params.otherUserId;
    let userId = req.session.userId;
    db.deleteFriendship(userId, otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            console.log("error in deleteFriendship", error);
            res.json({ success: false });
        });
});

router.post("/cancelFriendRequest/:otherUserId", (req, res) => {
    console.log("post cancelFriedRequest");
    let otherUserId = req.params.otherUserId;
    let userId = req.session.userId;
    db.cancelFriendshipRequest(userId, otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            console.log("error in cancelFriendRequest", error);
            res.json({ success: false });
        });
});

router.get("/friendsWannabees", (req, res) => {
    console.log("get friendsWannabees");

    let userId = req.session.userId;

    db.getFriendsWannabees(userId)
        .then(({ rows }) => {
            res.json({
                success: true,
                friendsWannabees: rows,
            });
        })
        .catch((error) => {
            console.log("error in friendsWannabees", error);
            res.json({ success: false });
        });
});

module.exports = router;
