// client/src/uploader.js
import { Component } from "react";
import axios from "../../axios";

import "./uploader.css";

/*
    Uploader's jobs:
    1. store the image the user selected in its own state 
    2. send the file to the server 
    3. let App know that there's a new profile picture, and that App needs to update its own state
*/

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
            image: "",
            error: false,
        };
        this.sendImage = this.sendImage.bind(this);
    }

    componentDidMount() {
        console.log("uploader mounted");
    }

    handleFileChange(e) {
        // Set the data's "image" property to the newly uploaded file

        this.setState({
            file: e.target.files[0],
        });
    }

    handleImageUpload() {
        // Prevent the default behavior (i.e navigating to a new page on submitting the form)
        console.log("click");

        var formData = new FormData();

        formData.append("file", this.state.file);
        console.log("file", this.state.file);
        //     formData.append("description", this.description);
        //     formData.append("username", this.username);
        //     formData.append("image", this.image);

        // 2. Post the form data to the "/upload" route with axios
        axios
            .post("/upload", formData)
            .then((res) => {
                console.log("response", res);
                this.sendImage(res.data.image);
            })
            .catch((err) => {
                console.log("error axois upload", err);
                this.setState({ error: true });
            });
    }

    sendImage(image) {
        // setImage is called in Uploader but it runs in App!
        // this means it is updating the state of App even though it's not called in App
        this.props.setImage(image);
    }

    render() {
        console.log("this.props in Uploader: ", this.props);
        return (
            <div className="uploader">
                <h4 onClick={this.props.closeUploader} className="closeBtn">
                    X
                </h4>
                {this.state.error && (
                    <h3 className="error">Ooops!! Something went wrong...</h3>
                )}
                <input
                    onChange={(e) => this.handleFileChange(e)}
                    type="file"
                    name="file"
                    id="file"
                    accept="image/*"
                ></input>
                <button onClick={() => this.handleImageUpload()}>Upload</button>
            </div>
        );
    }
}
