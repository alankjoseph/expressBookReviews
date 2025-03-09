const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBookPromise = (books)=>{
    return new Promise((resolve, reject)=>{
        if(books){
            resolve(books)
        }else{
            reject("no books are found")
        }
    })
}

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username
    const password = req.body.password
    if (username && password) {
        const isUserExist = isValid(username)
        if (isUserExist) {
            return res.status(403).json({ message: "user already exists" })
        }
        users.push({ "username": username, "password": password })
        return res.status(201).json({ message: "user created successfully " })
    } else if (!username && !password) {
        return res.status(400).json({ message: "bad request" })
    } else if (!username || !password) {
        return res.status(400).json({ message: "check username and password" })
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(books[isbn]);
    
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const authorName = req.params.author.toLowerCase(); // Convert to lowercase for case-insensitive search
    const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === authorName);

    if (matchingBooks.length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
    }

    res.status(200).json(matchingBooks);
    
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title.toLowerCase(); // Convert to lowercase for case-insensitive search
    const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);

    if (matchingBooks.length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
    }

    res.status(200).json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn
    const book = books[isbn]
    if(!book){
        return res.status(400).json({message:"no book found"})
    }
    const review = book.reviews
    res.status(200).json(review)
});

module.exports.general = public_users;
