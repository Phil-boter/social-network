# social-network

MONKEY BUSINESS is a clone of other social-networks like facebook

## About

    I builded this project during my attendance to the Coding Bootcamp at Spiced Academy's in Berlin.

    Users can sign up, sign in, logout. With AWS SES the user is able to reset the password.
    Signed-in the user is possible to upload a profile picture with the help of AWS s3
    and edit the porfile.
    The user can also make friend-request, accept or ignore them,
    watch already accepted requests and delete existing friendships.
    There is also a build in search function to search for new frienships.
    The user has the possibility to write wallposts and attach pictures to them,
    other users can read them when they call up the profile.
    With socket.io there is also a real time group chat implemented.
    Users can also send private messages, if they are friends.
    Tests are made with Jest.js.

## Technologies

    HTML5, CSS3, React.js, Redux, Node/Express, postgreSQL, AWS S3/SES

## Development

    To fork and work with this project follow these steps:

        # Clone the repository
        git clone https://github.com/Phil-boter/social-network

        # Go inside the directory
        cd social-network

        # Install dependencies
        npm install

        # Start server
        npm start
        # Start client server
        npm run dev:client
