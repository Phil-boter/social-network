export default function (state = {}, action) {
    console.log("reducer running");

    if (action.type == "GET_PRIVATE_MESSAGES") {
        state = {
            ...state,
            privateMessages: action.privateMessages,
        };
    }

    if (action.type == "SEND_PRIVATE_MESSAGE") {
        state = {
            ...state,
            privateMessages: [
                ...state.privateMessages,
                action.sentPrivateMessage,
            ],
        };
    }

    if (action.type == "GET_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages,
            idSelf: action.userId,
        };
    }

    if (action.type == "GET_POSTS") {
        state = {
            ...state,
            wallPosts: action.wallPosts,
        };
    }

    if (action.type == "ADD_POST") {
        state = {
            ...state,
            wallPosts: [action.newWallPost, ...state.wallPosts],
        };
    }

    if (action.type == "FRIENDS_WANNABEES") {
        state = {
            ...state,
            friendsWannabees: action.friendsWannabees,
        };
    }

    if (action.type == "ACCEPT_FRIEND_REQUST") {
        state = {
            ...state,
            friendsWannabees: state.friendsWannabees.map((user) => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type == "CANCEL_FRIEND_REQUST") {
        state = {
            ...state,
            friendsWannabees: state.friendsWannabees.filter((user) => {
                return user.id != action.id;
            }),
        };
    }

    if (action.type == "ADD_CHAT_MESSAGE") {
        console.log("state in add_chat", state);
        console.log("action.addMsg", action.addMsg);
        state = {
            ...state,
            chatMessages: action.addMsg,
        };
    }

    if (action.type == "NEW_CHAT_MESSAGE") {
        console.log("state in new_CHAT", state);
        console.log("action.newMessage", action.newMessage);
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.newMessage],
        };
    }

    return state;
}
