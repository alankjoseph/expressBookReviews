const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    const userMatches = users.filter((user) => user.username === username);
    return userMatches.length > 0;
}

const authenticatedUser = (username, password) => {
    const matchingUsers = users.filter((user) => user.username === username && user.password === password);
    return matchingUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username
    const password = req.body.password
    const authenticate = authenticatedUser(username, password)
    if (!authenticate) {
        return res.status(404).json({ message: "user is not registered" })
    }
    let accessToken = jwt.sign({data:password}, "access", {expiresIn: 3600});
    req.session.authorization = {accessToken,username};
    return res.status(200).send("User successfully logged in");


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.body.review;

    if (books[isbn]){
        books[isbn].reviews[username] = review;
        res.send(`The review of the book with ISBN ${isbn} from user ${username} has been published.`);
    } else {
        res.send(`No books with ISBN ${isbn} were found in the database.`);
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    if (books[isbn].reviews[username]){
        delete books[isbn].reviews[username];
        res.send(`The review of the book with ISBN ${isbn} from user ${username} has been deleted.`);
    } else {
        res.send(`No reviews with ISBN ${isbn} from user ${username} were found in the database.`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
