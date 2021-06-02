import { Component } from "react";
import axios from "./axios"; 
import { Link } from 'react-router-dom';


export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) { 
        console.log("event object name", e.target.name);
        console.log("event object value", e.target.value);
        this.setState({
            [e.target.name] : e.target.value,
        },
        () => console.log("this.state in handleChange", this.state) 
        );
    }

    handleClick() {
        console.log("click");
        console.log("state submit", this.state);
        axios.post("/login", this.state)
        .then(({data}) => {
            console.log("data", data);
            if(data.success) {
                location.replace("/");
            }
            else {
                this.setState({
                    error: true
                });
            }
        })
    }

    render() {
        return (
            <div className="input-section">
                <div> 
                    {this.state.error && <h3 className="error">Ooops!! Something went wrong...</h3>}
                    <h1 className="registration-headline">Login</h1>

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
                        
                        <button onClick={()=> this.handleClick()}>login</button>
                        <p className="register-link">Forgot your password? <Link to="/reset">Click here</Link></p>               
                        <p className="register-link">Not a member? <Link to="/">Registration</Link></p>
                </div>  
                   
            </div>
        );
    }
}