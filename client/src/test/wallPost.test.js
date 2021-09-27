import WallPost from "../components/wallpost/Wallpost";

import { render, fireEvent, screen } from "@testing-library/react";
import reducer from "../redux/reducer";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

const wallPosts = [
    {
        description: "hello test",
        image: null,
    },
];
const id = 2;
test("check if component renders loading when no wallposts", () => {
    const { container } = render(
        <Provider store={store}>
            <WallPost id={id} wallPosts={wallPosts} />
        </Provider>
    );
    // let element = container.querySelector("p");
    let element = container.querySelector(".wallpost-text");
    expect(element).toBeTruthy();
});
