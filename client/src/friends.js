import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    acceptFriendRequest,
    cancelFriendRequest,
    getFriendsWannabees,
} from "./actions";
import ProfilePic from "./profilepic";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector((state) => {
        return (
            state.friendsWannabees &&
            state.friendsWannabees.filter((user) => user.accepted == true)
        ); // user from reducer
    });

    console.log("state friends true", friends);

    const requests = useSelector((state) => {
        return (
            state.friendsWannabees &&
            state.friendsWannabees.filter((user) => user.accepted == false)
        );
    });

    console.log("state request false", requests);

    useEffect(() => {
        dispatch(getFriendsWannabees());
    }, []);

    return (
        <>
            <>
                <div className="friends-headline">
                    {friends && friends.length != 0 ? (
                        <h2 className="registration-headline">Your Friends</h2>
                    ) : (
                        <h2 className="registration-headline">
                            Sorry! You have no friends here at the moment. Find
                            new<Link to="/users">friends</Link>here
                        </h2>
                    )}
                </div>
                <div className="friends-container">
                    {friends &&
                        friends.map(
                            (user) => (
                                console.log("friend in div", user),
                                (
                                    <div className="friend" key={user.id}>
                                        <Link to={`/user/${user.id}`}>
                                            <ProfilePic />
                                        </Link>
                                        <p>
                                            {user.first} {user.last}
                                        </p>
                                        <button
                                            className="button-friend"
                                            onClick={() =>
                                                dispatch(
                                                    cancelFriendRequest(user.id)
                                                )
                                            }
                                        >
                                            End Friendship
                                        </button>
                                    </div>
                                )
                            )
                        )}
                </div>
            </>
            <>
                <div className="friends-headline">
                    {requests && requests.length != 0 ? (
                        <h2 className="registration-headline">
                            Your Friendrequests
                        </h2>
                    ) : (
                        <h2 className="registration-headline">
                            You do not have any friend requests at the moment
                        </h2>
                    )}
                </div>
                <div className="friends-container">
                    <div className="friends-list">
                        {requests &&
                            requests.map((user) => (
                                <div className="friend" key={user.id}>
                                    <Link to={`/user/${user.id}`}>
                                        <ProfilePic />
                                    </Link>
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                    <div className="button-container">
                                        <button
                                            className="button-accept"
                                            onClick={() =>
                                                dispatch(
                                                    acceptFriendRequest(user.id)
                                                )
                                            }
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="button-cancel"
                                            onClick={() =>
                                                dispatch(
                                                    cancelFriendRequest(user.id)
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </>
        </>
    );
}
