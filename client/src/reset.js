import { Component } from "react";
import axios from "./axios"; 
import { Link } from 'react-router-dom';


export default class Reset extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            display: 0,
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

    submitEmail() {
        console.log("click");
        console.log("state submit", this.state);
        axios.post("/password/reset/start", this.state)
        .then(({data}) => {
            console.log("data", data);
            if(data.success){
                this.setState({
                    error: false,
                    display: 1,
                }); 
            }
            else {
                this.setState({
                    error: true,
                });
            }
        })
    }    
    
    submitCode() {
        console.log("click");
        console.log("state submit", this.state);
        const { code, password, email} = this.state;
        axios.post("/password/reset/verify", { code, password, email})
        .then(({data}) => {
            console.log("data", data);
            if(data.success){
                this.setState({
                    error: false,
                    display: 2,
                }); 
            }
            else {
                this.setState({
                    error: true,
                });
            }
        })
    }

    getDisplay(display){
        if(display === 0){
            return (
                <div className="input-section">
                    <div> 
                        {this.state.error && <h3 className="error">Ooops!! Something went wrong...</h3>}
                        <h1 className="registration-headline">Reset Password</h1>
                        <p className="register-link">Please enter the email address with which you registered</p>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                onChange={(e) => this.handleChange(e)}
                            ></input>

                            <button onClick={()=> this.submitEmail()}>Submit</button>                
                            <p className="register-link">Not a member? <Link to="/">Registration</Link></p>
                    </div>                      
                </div>
            );
        }
        else if(display === 1) {
            return (
                <div className="input-section">
                    <div> 
                        {this.state.error && <h3 className="error">Ooops!! Something went wrong...</h3>}
                        <h1 className="registration-headline">Reset Password</h1>
                        <p className="register-link">Please enter the code you have received</p>
                            <input
                                type="text"
                                name="code"
                                placeholder="Code"
                                onChange={(e) => this.handleChange(e)}
                            ></input>
                        <p className="register-link">Please enter your new password</p>    
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={(e) => this.handleChange(e)}
                            ></input>
                            
                            <button onClick={()=> this.submitCode()}>Submit</button>                
                        <p className="register-link">Not a member? <Link to="/">Registration</Link></p>
                    </div>                     
                </div>
            );
        }
        else {
            return (
                <div className="input-section">
                    <div> 
                        {this.state.error && <h3 className="error">Ooops!! Something went wrong...</h3>}
                        <h1 className="registration-headline">Reset Password</h1>
                        <p className="register-link">You have successfully entered your password</p>
                        <p className="register-link">You can now <Link to="/login">login</Link> with your new password</p>
                    </div>                
                </div>
            );
        }
    }


    render() {
        return (
            <div className="input-section">
                {this.getDisplay(this.state.display)}                   
            </div>
        );
    }
}