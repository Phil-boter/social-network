import { Component } from "react";
import ProfilePic from "./components/profilePic/profilepic";
import Uploader from "./components/uploader/uploader";
import axios from "./axios";
import Profile from "./routes/profile/profile";
import OtherProfile from "./routes/otherProfile/otherprofile";
import { BrowserRouter, Route } from "react-router-dom";
import FindPeople from "./routes/findpeople/findpeople";
import { Link } from "react-router-dom";
import Friends from "./routes/friends/friends";
import Chat from "./routes/chat/chat";
import PrivateChat from "./routes/privateChat/PrivateChat";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            image: "",
            id: "",
            bio: "",
            uploaderIsVisible: false,
        };
        // we could bind setImage with the arrow function syntax, too!
        this.setImage = this.setImage.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setBio = this.setBio.bind(this);
        this.closeUploader = this.closeUploader.bind(this);
        // this.setNavigation = this.setNavigation.bind(this);
    }

    componentDidMount() {
        console.log("component did mount");

        axios.get("/user.json").then(({ data }) => {
            if (data.success) {
                console.log("data", data);
                this.setState({
                    success: true,
                    id: data.id,
                    first: data.first,
                    last: data.last,
                    image: data.image,
                    bio: data.bio,
                    uploaderIsVisible: false,
                });
                console.log("state", this.state);
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }

    // this is passed down to ProfilePic as a prop
    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    closeUploader() {
        console.log("click close uploader");
        this.setState({
            uploaderIsVisible: false,
        });
    }

    // this is passed to Uploader as a prop
    setImage(image) {
        /*
            This method allows Uploader to communicate with App.
                - This method is passed to Uploader as a prop
                - Uploader can call this method, and can pass it an argument
                - Uploader calls setImage, but setImage will run in App
                - The result is that the state of App will be updated 
        */
        console.log("newProfilePic: ", image);
        this.setState({
            image: image,
            uploaderIsVisible: false,
        });
    }

    setBio(bio) {
        console.log("newBio", bio);
        this.setState({
            bio: bio,
            uploaderIsVisible: false,
        });
    }

    render() {
        console.log("this.state.first: ", this.state.first);
        console.log("this.state.last: ", this.state.last);
        return (
            <BrowserRouter>
                <>
                    <div className="app-container">
                        <div className="header">
                            <div className="logo">
                                <img src="/monkeyBack.png" />
                            </div>
                            <div>
                                <ul className="links-container">
                                    <li className="nav-link">
                                        <Link to="/chat">Chat</Link>
                                    </li>

                                    <li className="nav-link">
                                        <Link to="/friends">Friends</Link>
                                    </li>
                                    <li className="nav-link">
                                        <Link to="/users">Find People</Link>
                                    </li>
                                    <li className="nav-link">
                                        <Link to="/">Profile</Link>
                                    </li>
                                    <li className="nav-link">
                                        <a href="/logout">logout</a>
                                    </li>
                                </ul>
                                <img
                                    className="header-palm"
                                    src="/palme1.png"
                                />
                            </div>
                            <div
                                className="header-pic"
                                onClick={this.toggleUploader}
                            >
                                <ProfilePic
                                    toggleUploader={this.toggleUploader}
                                    first={this.state.first}
                                    last={this.state.last}
                                    image={this.state.image}
                                />
                            </div>
                        </div>
                        <div className="uploader-container">
                            {this.state.uploaderIsVisible && (
                                <Uploader
                                    setImage={this.setImage}
                                    closeUploader={this.closeUploader}
                                />
                            )}
                        </div>
                    </div>

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                toggleUploader={this.toggleUploader}
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                image={this.state.image}
                                bio={this.state.bio}
                                setBio={this.setBio}
                            />
                        )}
                    />

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                id={this.state.id}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/privateChat/:id"
                        render={(props) => (
                            <PrivateChat
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                                id={this.state.id}
                            />
                        )}
                    />

                    <Route path="/chat" render={() => <Chat />} />

                    <Route path="/users" render={() => <FindPeople />} />

                    <Route path="/friends" render={() => <Friends />} />
                </>
            </BrowserRouter>
        );
    }
}
