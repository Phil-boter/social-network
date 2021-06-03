import React from "react";

import "./profilepic.css";

export default function ProfilePic(props) {
    console.log("props in ProfilePic: ", props);
    return (
        <>
            {props.image ? (
                <img
                    id="img"
                    src={props.image}
                    onClick={props.toggleUploader}
                    alt={`${props.first} ${props.last}`}
                />
            ) : (
                <img
                    id="img"
                    src="/monkeyBack.png"
                    onClick={props.toggleUploader}
                    alt={`${props.first} ${props.last}`}
                />
            )}
        </>
    );
}
