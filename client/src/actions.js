import axios from "./axios";

export async function getPrivateMessages(id) {
    const { data } = await axios.get(`/user/messages/${id}`);
    return {
        type: "GET_PRIVATE_MESSAGES",
        privateMessages: data.success,
    };
}

export async function sendPrivateMessage(message, id) {
    const { data } = await axios.post("/user/message", {
        message: message,
        otherId: id,
    });
    return {
        type: "SEND_PRIVATE_MESSAGE",
        sentPrivateMessage: data.success,
    };
}

export function getMessages({ result }, id) {
    return {
        type: "GET_MESSAGES",
        chatMessages: result,
        userId: id,
    };
}

export async function getWallPosts(id) {
    console.log("Action wall ", id);
    const { data } = await axios.get(`/user/wall/${id}`);
    console.log("data action wall ", data);
    return {
        type: "GET_POSTS",
        wallPosts: data.success,
    };
}

export async function addWallPost(formData) {
    const { data } = await axios.post(`/user/wall/post`, formData);
    return {
        type: "ADD_POST",
        newWallPost: data.success,
    };
}

export async function getFriendsWannabees() {
    console.log("actions getFriendsWannabees");

    const { data } = await axios.get("/friendsWannabees");

    console.log("data from friendsWannabees", data);

    return {
        type: "FRIENDS_WANNABEES",
        friendsWannabees: data.friendsWannabees,
    };
}

export async function acceptFriendRequest(id) {
    const { data } = await axios.post(`/acceptFriendRequest/${id}`);

    console.log("data in action acceptFriendRequest", data);

    if (data.success) {
        return {
            type: "ACCEPT_FRIEND_REQUST",
            id: id,
        };
    }
}

export async function cancelFriendRequest(id) {
    const { data } = await axios.post(`/deleteFriendship/${id}`);

    console.log("data in action cancelFriendRequest", data);

    if (data.success) {
        return {
            type: "CANCEL_FRIEND_REQUST",
            id: id,
        };
    }
}

export async function addMessageToRedux(addMsg) {
    console.log("data actions addMessageToRedux", addMsg);
    return {
        type: "ADD_CHAT_MESSAGE",
        addMsg: addMsg,
    };
}
export async function chatMessages(newMessage) {
    console.log("data actions chatMessages", newMessage);
    return {
        type: "NEW_CHAT_MESSAGE",
        newMessage: newMessage,
    };
}

// export async function onlineList(newUser) {
//     console.log("DATA actions onlineUser", newUser);
//     return {
//         type: "ONLINE_USERS",
//         data: newUser,
//     };
// }
