import { Component } from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";


export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            image: "",
            id: "",
            bio: "",
            error: false,
        };

    }

    componentDidMount() {
        console.log("component mounted otherprofile");
        console.log("this.props.match: ", this.props.match);
        console.log("id: ", this.props.match.params.id);
        console.log("props id:", this.state.id);
        // we should  make a request to our server to get the other user's data using the id
        // If we are trying to view our own profile,
        // we should make sure to send the user back to the '/' route
        const id = this.props.match.params.id;
        axios.get(`/user/${id}.json`)
            .then(({data})=> {
                if(data.success){
                    console.log("data otherprofile",data);
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
                }
                else {
                    this.setState({
                        error: true
                    });
                }    
        });     


    }

    componentDidUpdate() {
        console.log("id update: ", this.props.match.params.id);
        console.log("props id:", this.props.id);
        console.log("state id:", this.state.id);
        if (this.props.match.params.id == this.props.id) {
            this.props.history.push("/");
        }
    }

    renderUserImage() {
        if(this.state.image) {
            return(
                <>
                    <img src={this.state.image} />
                </>
            );
        }
        else {
            return(
                <>
                    <img src="/monkeyBack.png" />
                </>
            );
        }
    }

    renderUserBio() {
        if(this.state.bio) {
            return(
                <>
                    <h2>About me</h2>
                    <p>{this.state.bio}</p>
                </>
            );
        }
        else {
            return(
                <>
                    <p>{this.state.first} has not provided anything yet!</p>
                </>
            );
        }
    }

    render() {
        return (
        <>    
            <div className="profile-container">                
                <div className="pro-img-container">

                    {this.renderUserImage()}

                    <FriendButton 
                        userId = {this.state.id}
                        otherUserId = {this.props.match.params.id}                       
                    />
                </div>

                <div className="profile-content">
                    {this.state.error && <h3 className="error">Ooops!! Something went wrong...</h3>}
                    <h3>{this.state.first} {this.state.last}</h3>
                    {this.renderUserBio()}
                </div>
                </div>
            

        </>    
        );
    }
}