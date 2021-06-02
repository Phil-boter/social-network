import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat() {
    // 1. retrieve chat messages from Redux and render them


    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("chatmessages: ", chatMessages);

    // scrolling maesages to last
    const elemRef = useRef();
    useEffect(() => {
        console.log("component chat mounted");
        console.log("clientheight:", elemRef.current.clientHeight);
        console.log("scrollheight:", elemRef.current.scrollHeight);
        const clientHeight = elemRef.current.clientHeight;
        const scrollHeight = elemRef.current.scrollHeight;
        elemRef.current.scrollTop = scrollHeight - clientHeight;
        console.log("scrolltop",elemRef.current.scrollTop);
    },[chatMessages]);

    // 2. post new messages
    const handleKeyDown = (e) => {
        console.log("textarea chat", e.target.value);
        if (e.key === "Enter") {
            console.log("user pressed enter!");
            // send message off to server using sockets
            // socket.emit will send a message to the server
            socket.emit("myNewMessage", e.target.value);
            e.target.value = "";
        }
    };

    console.log("elemRef", elemRef)
    return (
            <>
                <h1 className="heading-user">monkey chat</h1>
                <div className="chat-container"  >
                    {chatMessages && chatMessages.map((user, index)=>(
                        console.log("message in chat render", user),
                        <div className="message-container" key={index}>
                            <div className="chat-image">
                                <Link to={`/user/${user.id}`}><img src={user.image} /></Link>
                            </div>
                            <div className="chat-message">
                                <p>{user.first}&nbsp; &nbsp; &nbsp; &nbsp; <span>{user.created_at}</span></p>
                                <p>{user.message}</p>
                            </div> 
                    </div>   
                    ))}
                </div>
                <textarea 
                    ref={elemRef}
                    onKeyDown={handleKeyDown} 
                    className="chat-text-input"
                    placeholder="add your message here..."
                    col="80"
                    row="3" />       
        </>
    );
}