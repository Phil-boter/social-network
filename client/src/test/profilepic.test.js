import ProfilePic from "../components/profilePic/profilepic";

import { render, fireEvent, screen } from "@testing-library/react";

test("When no url is passed a placeholder is used as src.", () => {
    const { container } = render(<ProfilePic />);

    expect(container.querySelector("img").src.endsWith("/monkeyBack.png")).toBe(
        true
    );
});

test("When url is passed as prop, that url is set as the value of the src attribute.", () => {
    const { container } = render(<ProfilePic image="/test/test.com" />);

    expect(container.querySelector("img").src.endsWith("/test/test.com")).toBe(
        true
    );
});

test("When first and last props are passed, first and last are assigned the value of the alt attribute", () => {
    const { container } = render(<ProfilePic first="foo" last="bar" />);

    expect(container.querySelector("img").alt).toBe("foo bar");
});

test("uploader prop runs when the image is clicked.", () => {
    const mockOnClick = jest.fn();
    mockOnClick.mockReturnValue(true);
    const { container } = render(<ProfilePic onClick={mockOnClick} />);

    console.log(fireEvent.click(container.querySelector("img")));
    fireEvent.click(container.querySelector("img"));
    expect(mockOnClick.mock.results[0].value).toBe(true);
});
