const express = require("express");
const app = express();

const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./database/db");
const csurf = require("csurf");

const server = require("http").Server(app);

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const friendsRouter = require("./routers/friendsRouter");
const chatRouter = require("./routers/chatRouter");

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

app.use(express.static("./uploads"));

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

// must be after cookiesession
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.get("/welcome", (req, res) => {
    console.log("req welcome", req);
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.use(authRouter);
app.use(userRouter);
app.use(friendsRouter);
app.use(chatRouter);

// always has to be at last before .listen
app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        // serve the requested page
        // NEVER comment out this line!!
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

// replace app with server so io can connect
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", function (socket) {
    // this is an event listener. It will run whenever a new user connects

    console.log(`socket with id ${socket.id} just connected!`);
    console.log(
        "socket.request.session.userId: ",
        socket.request.session.userId
    );

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    db.getLastTenMessages()
        .then(({ rows }) => {
            let addMsg = rows;
            console.log("result getLasttenMessagee", rows);
            addMsg.reverse();
            io.sockets.emit("addMessageToRedux", addMsg);
        })
        .catch((error) => {
            console.log("error in getlastTenMessages", error);
        });

    // when the user posts a new chat message...
    socket.on("myNewMessage", (newMessage) => {
        console.log("msg in sockt.on myNewMessage", newMessage);
        console.log(
            "socket.request.session in myNewMessage",
            socket.request.session
        );
        const id = socket.request.session.userId;
        db.newChatMessage(newMessage, id)
            .then(({ rows }) => {
                let messageId = rows[0].message_id;
                console.log("rows newChatMessage", messageId);
                db.getLastChatMessage(messageId)
                    .then(({ rows }) => {
                        console.log("ROWS in getLaastMessage", rows[0]);
                        newMessage = rows[0];
                        io.sockets.emit("myNewMessage", newMessage); // myNewMessage from chats handleKeydown socket.emit
                    })
                    .catch((error) => {
                        console.log("error in getLastChatMessage", error);
                    });
            })
            .catch((error) => {
                console.log("error in socket on myNewMessage", error);
            });
    });
});

// const onlineUsers = {};
// let newUser = {};
//     // // get online users
//     //     let userId = socket.request.session.userId;
//     //     onlineUsers[socket.id] = userId;
//     //     console.log("id get online users", socket.request.session.userId);
//     //     db.getOnlineUser(userId)
//     //         .then(({rows}) => {
//     //             console.log("result new", rows);
//     //             newUser = {
//     //                 socketId: socket.id,
//     //                 id: rows[0].id,
//     //                 first: rows[0].first,
//     //                 last: rows[0].last,
//     //                 image: rows[0].image,
//     //             };

//     //             // console.log("onlineUser", newUser);
//     //             console.log("onlineUsers", onlineUsers);

//     //             onlineUsers.push(newUser);

//     //             io.sockets.emit("onlineList", onlineUsers);

//     //         })
//     //         .catch(error => {
//     //             console.log("error in socket getUserData", error);
//     //         });
