import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./auth/registration/registration";
import Login from "./auth/login/login";
import Reset from "./auth/reset/reset";

export default function Welcome() {
    // no class because no logic
    return (
        <>
            <div className="palmtree">
                <img src="/palme1.png" />
            </div>
            <div className="welcome-section">
                <div className="welcome-content">
                    <h3>Welcome to</h3>

                    <div className="monkey">
                        <img src="/monkeyBack.png" alt="logo" />
                    </div>
                    <h1 className="welcome-headline">
                        Monkey<br></br>Business
                    </h1>
                    <p>Let's do some monkey business</p>

                    <HashRouter>
                        <div>
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                            <Route path="/reset" component={Reset} />
                        </div>
                    </HashRouter>
                </div>
            </div>
        </>
    );
}
