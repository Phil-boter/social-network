import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom"
import { useState, useEffect } from "react";

export default function FindPeople(props) {
    const [latestUsers, setLatestUser] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        // console.log(`${first}: Console log happening in useEffect`);
        axios.get("/latestUsers")
            .then(({data})=> {
                console.log("data find latest user:", data);
                setLatestUser(data.latestUsers);
                console.log("latestUsers:", data.latestUsers);
            })
            .catch((error) => {
                console.log("error in get/latestUser", error);
                
            })

        if(input){
            let abort = false;
            axios.get(`/searchForUsers/` + input)
                .then(({data})=> {
                    if(!abort){
                        console.log("data find searched user:", data);
                        setSearchResult(data.searchResult);
                        console.log("searchResult:", data.searchResult);
                    }
                    else {
                        return () => {
                            console.log(`About to replace ${input} with a new value`);
                            abort = true;
                        };
                    }
                })
                .catch((error) => {
                    console.log("error in get/searchForUsers", error);
                })
            }
    }, [input]);



    console.log("********* RENDERING <FindPeople /> *************");
    return (
        <>
            {/* {error && <h3 className="error">Ooops!! Something went wrong...</h3>} */}
            <h2 className="heading-user">Find new friends</h2>

            <div>
                <div className="user-maincontainer">
                    <h3>See who have joined today!</h3>
                    <div className="container-user">
                        <ul>
                            {latestUsers.map((latestUsers, index) => (
                                <div  key={index} className="container-singleUser">
                                    <li>
                                        <Link to={`/user/${latestUsers.id}`}>
                                        <img src={latestUsers.image} onClick={props.toggleUploader} className="user-img" />
                                        
                                        <p className="user-info">{latestUsers.first} {latestUsers.last}</p>
                                        </Link>
                                    </li>
                                </div>
                            ))}
                            
                        </ul>
                    </div>
                </div>
            </div>


            <div>
                <div className="user-maincontainer">                  
                    <h3>Are you looking for someone in particular?</h3>
                    <div className="container-user">
                        <div className="search-input">
                            <input 
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="search for users here..."
                                className="search-field"
                            />
                        </div>
                        {!input.length && input && <li>Nothing Found</li>}

                        <ul>
                            {input && searchResult.map((searchResult, index) => (
                                <div key={index} className="container-singleUser">
                                    <li>
                                        <Link to={`/user/${searchResult.id}`}>
                                        <img src={searchResult.image}  className="user-img"  />
                                        
                                        <p className="user-info">{searchResult.first} {searchResult.last}</p>
                                        </Link>
                                    </li>
                                </div>
                            ))}
                            {!searchResult.length && input && <li className="found">Nothing Found</li>}
                        </ul>
                    </div>
                    </div>
                </div>  

        </>
    );
}

