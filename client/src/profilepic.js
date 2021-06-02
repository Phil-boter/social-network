// before v17 of React we HAD to write "import React from 'react'" in every component
// function components included!
import React from "react";

/*
    ProfilePic's jobs:
    1. render the profile pic
    2. if there is no profile pic, render a default image 
    3. when the user clicks on the profile pic, toggle the Uploader component
*/

/*
    ProfilePic's props:
    1. profilePic
    2. toggleUploader
    3. (optional) the user's name, which can be set as the alt attribute of the img
*/

export default function ProfilePic({ first, last, image, toggleUploader }) {
    console.log("props in ProfilePic: ", first, last, image, toggleUploader );
    if(image){
        return (
            <>
                <img src={image} onClick={toggleUploader} alt={first, last} />

            </>
        );
    }
    else {
        return (
            <>
                <img src="/monkeyBack.png" onClick={toggleUploader} alt={(first, last)} />

            </>
        )
    }
}