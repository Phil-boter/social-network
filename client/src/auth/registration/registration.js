//registration is going to be a class component there will be logic in state so class

import { Component } from "react";
import axios from "../../axios"; // in react it is not globally available
import { Link } from "react-router-dom";

export default class Registration extends Component {
    // default -- import without {}
    constructor() {
        super();
        this.state = {
            error: false,
        };
        // this.handleChange = this.handleChange.bind(this); // because of class not react here using arrow function in onChange JSX
        // "this" in the constructor refers to "Registration"
        // so .bind passes that "this" to handleChange method
    }

    handleChange(e) {
        // e-- event Object to handle th users input from "name" property of event-object
        console.log("event object name", e.target.name);
        console.log("event object value", e.target.value);
        this.setState(
            {
                [e.target.name]: e.target.value, // [] tells setState thate.target.name is a variable
            },
            () => console.log("this.state in handleChange", this.state) // because setState is asyncronous
        );
    }

    handleClick() {
        console.log("click");
        console.log("state submit", this.state);
        axios.post("/registration", this.state).then(({ data }) => {
            console.log("data", data);
            if (data.success) {
                location.replace("/");
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }

    render() {
        return (
            <div className="input-section">
                <div>
                    {this.state.error && (
                        <h3 className="error">
                            Ooops!! Something went wrong...
                        </h3>
                    )}
                    <h1 className="registration-headline">Registration</h1>

                    <input
                        type="text"
                        name="first"
                        placeholder="First name"
                        onChange={(e) => this.handleChange(e)} // arrow function instead of .bind but don't mix them up
                    ></input>

                    <input
                        type="text"
                        name="last"
                        placeholder="Last name"
                        onChange={(e) => this.handleChange(e)}
                    ></input>

                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => this.handleChange(e)}
                    ></input>

                    <button onClick={() => this.handleClick()}>Submit</button>
                    <p className="register-link">
                        Already registered? <Link to="/login">Click here!</Link>
                    </p>
                </div>
            </div>
        );
    }
}
