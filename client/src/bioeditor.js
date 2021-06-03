import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaVisible: false,
            error: false,
            bio: "",
        };
        // this.editBio.bind(this);
        this.sendBio = this.sendBio.bind(this);
    }

    componentDidMount() {
        console.log("bioeditor mounted");
    }

    handleChange(e) {
        this.setState(
            {
                bio: e.target.value,
            },
            () => {
                console.log("handleChange Func: this.state", this.state);
            }
        );
    }

    editBio() {
        this.setState({
            textareaVisible: true,
        });
    }

    uploadBio() {
        console.log("click uploadBio");
        console.log("state uploadBio", this.state);
        axios
            .post("/uploadBio", { bio: this.state.bio })
            .then((res) => {
                console.log("response", res);
                this.sendBio(res.data.bio);
                this.setState({ textareaVisible: false });
            })
            .catch((error) => {
                console.log("error in uploadBio", error);
                this.setState({ error: true });
            });
    }

    sendBio(bio) {
        console.log("send bio from edit to app");
        this.props.setBio(bio);
    }

    renderEditor() {
        console.log("state textarea", this.state.textareaVisible);
        if (!this.state.textareaVisible) {
            if (this.props.bio) {
                return (
                    <div>
                        <h2>About me</h2>
                        <p>{this.props.bio}</p>
                        <button
                            className="edit-button"
                            onClick={() => this.editBio()}
                        >
                            Edit
                        </button>
                    </div>
                );
            } else {
                return (
                    <div>
                        <p>Tell us something about yourself</p>
                        <button
                            className="edit-button"
                            onClick={() => this.editBio()}
                        >
                            Add your bio now
                        </button>
                    </div>
                );
            }
        } else {
            return (
                <div>
                    <textarea
                        className="bio-textarea"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.props.bio}
                        placeholder="write something here"
                    />
                    <button
                        className="upload-button"
                        onClick={() => this.uploadBio()}
                    >
                        Upload
                    </button>
                    {this.state.error && (
                        <h3 className="error">
                            Ooops!! Something went wrong...
                        </h3>
                    )}
                </div>
            );
        }
    }
    render() {
        return <>{this.renderEditor()}</>;
    }
}
