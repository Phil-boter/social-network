import { Component } from "react";
import { useEffect, useState } from "react";
import axios from "./axios"; 

export default function FriendButton({ otherUserId }) {

    const [button, setButtonText] = useState();

    const PATTERN = {
        SEND: "Send Friend Request",
        END: "End Friendship",
        ACCEPT: "Accept Friend Request",
        CANCEL: "Cancel Friend Request",
    };



    useEffect(()=> {
        console.log("mounted and otherUserId", otherUserId); // from otherprofile

        axios.get(`/friendshipStatus/${otherUserId}`)
            .then(({data})=> {
                console.log("data get friendshipStatus: ", data);
                console.log("data get friendshipStatus: ", data.friendshipStatus[0]);
                console.log("userId: ", data.userId);
                if(!data.friendshipStatus[0]){
                    setButtonText(PATTERN.SEND);
                }
                else if (data.friendshipStatus[0].accepted) {
                    setButtonText(PATTERN.END);
                }
                else {
                    data.friendshipStatus[0].sender_id == data.userId ? setButtonText(PATTERN.CANCEL) : setButtonText(PATTERN.ACCEPT);

                }
            })
    },[button])
    
    function handleClick() {
        console.log("click firendbutton");
        console.log("clich button Text", button);
        if(button == PATTERN.SEND) {
            axios.post(`/sendFriendRequest/${otherUserId}`)
                .then(res => {
                    console.log("response sendFriendRequest: ", res);
                    setButtonText("")
                })
                .catch(error => {
                    console.log("error in SendFriendRequest", error);
                })
        }
        if(button == PATTERN.END) {
            axios.post(`/deleteFriendship/${otherUserId}`)
                .then(res => {
                    console.log("response in endFriendship: ", res);
                    setButtonText("");
                })
                .catch(error => {
                    console.log("error in endFriendship", error);
                })
        }
        if(button == PATTERN.CANCEL) {
            axios.post(`/cancelFriendRequest/${otherUserId}`)
                .then(res => {
                    console.log("response in cancel Request: ", res);
                    setButtonText("");
                })
                .catch(error => {
                    console.log("error in cancel request", error);
                })
        }
        if(button == PATTERN.ACCEPT) {
            axios.post(`/acceptFriendRequest/${otherUserId}`)
                .then(res => {
                    console.log("response in accept request: ", res);
                    setButtonText("");
                })
                .catch(error => {
                    console.log("error in accept request", error);
                })
        }
    }

    return (
         
            <button onClick={handleClick} className="friendbutton">{button}</button>
        
    );

}