import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";
import Wallpost from "./wallpost/Wallpost";

export default function Profile(props) {
    console.log("props in profile", props);
    // console.log("state", this.state)
    return (
        <>
            {!props.id ? (
                <>Loading UserData</>
            ) : (
                <div className="profile-container">
                    <div className="pro-img-container">
                        <ProfilePic
                            toggleUploader={props.toggleUploader}
                            first={props.first}
                            last={props.last}
                            image={props.image}
                        />
                    </div>
                    <div className="profile-content">
                        <h3>
                            {props.first} {props.last}
                        </h3>
                        <BioEditor bio={props.bio} setBio={props.setBio} />
                        <Wallpost id={props.id} edit={true} />
                    </div>
                </div>
            )}
        </>
    );
}
