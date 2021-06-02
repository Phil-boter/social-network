const express = require("express");
const router = express.Router();

const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("../utils/s3");
const { s3Url } = require("../utils/config.json");
const path = require("path");
const db = require("../database/db");

// --------------------- Multer configurations ------------------------------------------------------

router.use(express.static("../uploads"));
router.use(express.static(path.join(__dirname, "..", "client", "public")));

// const diskStorage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, __dirname + "/../uploads");
//     },
//     filename: function (req, file, callback) {
//         uidSafe(24).then((uid) => {
//             callback(null, uid + path.extname(file.originalname));
//         });
//     },
// });

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log("callback1", file);
        callback(null, __dirname + "../../../client/public");
    },
    filename: function (req, file, callback) {
        console.log("file", file);
        callback(null, file.originalname);
    },
});

const upload = multer({
    storage: diskStorage,
    limits: {
        // Set a file size limit to prevent users from uploading huge files and to protect against DOS attacks
        fileSize: 2097152,
    },
});
// --------------------- Multer configurations End ------------------------------------------------------

router.get("/user.json", (req, res) => {
    console.log("get user");
    console.log("req session", req.session);
    db.getUserData(req.session.userId)
        .then(({ rows }) => {
            res.json({
                success: true,
                id: rows[0].id,
                first: rows[0].first,
                last: rows[0].last,
                image: rows[0].image,
                bio: rows[0].bio,
            });
        })
        .catch((error) => {
            console.log("error in getUserData", error);
            res.json({ success: false });
        });
});

router.get("/user/:id.json", (req, res) => {
    console.log("get request user/id");
    console.log("req session", req.session);
    console.log("req params", req.params);
    db.getUserData(req.params.id)
        .then(({ rows }) => {
            res.json({
                success: true,
                id: rows[0].id,
                first: rows[0].first,
                last: rows[0].last,
                image: rows[0].image,
                bio: rows[0].bio,
            });
        })
        .catch((error) => {
            console.log("error in getUserData", error);
            res.json({ success: false });
        });
});

router.post("/upload", upload.single("file"), (req, res) => {
    // s3.upload,
    console.log("post request is coming");

    // let imageUrl = `${s3Url}${req.file.filename}`;
    let imageUrl = `${req.file.filename}`;
    let userId = req.session.userId;
    db.uploadImage(imageUrl, userId)
        .then(({ rows }) => {
            console.log("rows:", rows);
            res.json({
                success: true,
                image: rows[0].image,
            });
        })
        .catch((err) => {
            console.log("Error in uploadImage", err);
            res.json({
                success: false,
            });
        });
});

router.post("/uploadBio", (req, res) => {
    console.log("post uploadBio");
    console.log("req.body :", req.body);
    console.log("req.session:", req.session.userId);
    let bio = req.body.bio;
    let userId = req.session.userId;
    db.updateBio(bio, userId)
        .then(({ rows }) => {
            res.json({
                success: true,
                bio: rows[0].bio,
            });
        })
        .catch((error) => {
            console.log("error in uloadBio", error);
            res.json({ success: false });
        });
});

router.post(
    "/user/wall/post",
    upload.single("image"),
    // s3.upload,
    (req, res) => {
        if (req.file) {
            const id = req.session.userId;
            // const url = `${s3Url}${req.file.filename}`;
            let url = `${req.file.filename}`;
            const description =
                req.body.description != "undefined"
                    ? req.body.description
                    : null;
            db.addWallPost(id, url, description)
                .then(({ rows }) => {
                    res.json({ success: rows[0] });
                })
                .catch((err) => {
                    console.log("Wall post error: ", err);
                    res.json({ error: true });
                });
        } else {
            res.json({ error: true });
        }
    }
);

router.get("/user/wall/:id", (req, res) => {
    const { id } = req.params;
    db.getWallPost(id)
        .then(({ rows }) => {
            res.json({ success: rows });
        })
        .catch((err) => {
            console.log("Get wall posts error: ", err);
            res.json({ error: true });
        });
});

module.exports = router;
