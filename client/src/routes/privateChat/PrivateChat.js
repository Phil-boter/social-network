import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import ProfilePic from "../../components/profilePic/profilepic";
import { getPrivateMessages, sendPrivateMessage } from "../../redux/actions";

import "./privateChat.css";

export default function PrivateChat(props) {
    console.log("private chat", props);
    const dispatch = useDispatch();
    const chatMessages = useSelector((state) => state && state.privateMessages);
    const elemRef = useRef("");
    const otherId = props.match.params.id;

    useEffect(() => {
        dispatch(getPrivateMessages(otherId));
    }, [chatMessages]);

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
    console.log("user id", props.id, otherId);

    if (!chatMessages) {
        return <p>Loading</p>;
    }

    return (
        <>
            <h1 className="registration-headline private-chat">
                Private Chatroom
            </h1>
            <div className="outer-chat-container">
                <ul className="inner-chat-container" ref={elemRef}>
                    {chatMessages.map((message) => (
                        <li className="chat-field" key={message.id}>
                            {message.user == props.id && (
                                <div className="user-self-container">
                                    <div className="user-self">
                                        <Link className="chat-user" to="/">
                                            <div className="chat-pic">
                                                <ProfilePic
                                                    first={message.first}
                                                    last={message.last}
                                                    image={message.image}
                                                />
                                            </div>
                                        </Link>
                                        <span className="user-info-chat">
                                            <p>
                                                {message.first} {message.last}
                                            </p>
                                            <span>{message.message}</span>
                                            <p>{message.time}</p>
                                        </span>
                                    </div>
                                </div>
                            )}
                            {message.user != props.id && (
                                <div className="user-other-container">
                                    <div className="user-other">
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
                                        </Link>
                                        <span className="user-info-chat">
                                            <p>
                                                {message.first} {message.last}
                                            </p>
                                            <span>{message.message}</span>
                                            <p>{message.time}</p>
                                        </span>
                                    </div>
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
