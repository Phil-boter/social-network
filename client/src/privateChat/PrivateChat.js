import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import ProfilePic from "../profilepic";
import { getPrivateMessages, sendPrivateMessage } from "../actions";

import "./privateChat.css";

export default function PrivateChat(props) {
    console.log("private chat", props);
    const dispatch = useDispatch();
    const chatMessages = useSelector((state) => state && state.privateMessages);
    const userId = useSelector((state) => state && state.idSelf);
    const elemRef = useRef("");
    const otherId = props.match.params.id;

    useEffect(() => {
        dispatch(getPrivateMessages(otherId));
    }, []);

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.scrollTop = elemRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            dispatch(sendPrivateMessage(e.target.value, otherId));
            e.target.value = null;
        }
    };
    console.log("user id", userId, props.id);
    const messageFromMe = userId === props.id;
    const className = props.id
        ? "Messages-message"
        : "Messages-message currentMember";

    if (!chatMessages) {
        return <p>Loading</p>;
    }

    return (
        <>
            <h2 className="title">Private Chatroom</h2>
            <div className="outer-chat-container">
                <ul className="inner-chat-container" ref={elemRef}>
                    {chatMessages.map((message) => (
                        <li className="chat-field" key={message.id}>
                            {message.user == userId && (
                                <div className={className}>
                                    <span>{message.message}</span>
                                    <Link className="chat-user" to="/">
                                        <span className="user-info-chat">
                                            <p>You</p>
                                            <p>{message.time}</p>
                                        </span>
                                        <div className="chat-pic">
                                            <ProfilePic
                                                first={message.first}
                                                last={message.last}
                                                image={message.image}
                                            />
                                        </div>
                                    </Link>
                                </div>
                            )}
                            {message.user != userId && (
                                <div className={className}>
                                    <span>{message.message}</span>
                                    <Link
                                        className="chat-user"
                                        to={`/users/${message.user}`}
                                    >
                                        <div className="chat-pic">
                                            <ProfilePic
                                                first={message.first}
                                                last={message.last}
                                                image={message.image}
                                            />
                                        </div>
                                        <span className="user-info-chat">
                                            <p>
                                                {message.first} {message.last}
                                            </p>
                                            <p>{message.time}</p>
                                        </span>
                                    </Link>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <textarea
                className="chat-textarea"
                onKeyDown={handleKeyDown}
                placeholder="Compose Message"
                rows="4"
                cols="60"
            />
            <Link className="chat-user" to={`/users/${otherId}`}>
                <button className="edit-button">Back</button>
            </Link>
        </>
    );
}
