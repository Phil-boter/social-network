// client/src/socket.js
import io from "socket.io-client";
import { chatMessages, addMessageToRedux } from "./redux/actions";

export let socket;

// this file will RECEIVE messages from the SERVER
export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }

    socket.on("myNewMessage", (newMessage) => {
        // this will run when a user posts a new message
        store.dispatch(chatMessages(newMessage));
    });

    socket.on("addMessageToRedux", (addMsg) => {
        // this will run when the user logs in
        console.log("chatmessages:", addMsg);
        store.dispatch(addMessageToRedux(addMsg));
    });
};
