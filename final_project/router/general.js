const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooksPromise = (books)=>{
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
public_users.get('/', async function (req, res) {
    const booklist = await getBooksPromise(books)
    res.status(200).json(booklist)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    getBooksPromise(books[isbn])
    .then(
        result => res.send(result),
        error => res.send(error)
    )
    
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    const author = req.params.author;
    let book = [];
    let bookList = await getBooksPromise(books);

    Object.keys(bookList).forEach(i => {
        if(bookList[i].author.toLowerCase() == author.toLowerCase()){
            book.push(books[i])
        }
    });
    res.send(book);
    
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    const title = req.params.title;
    let book = [];
    let bookList = await getBooksPromise(books);

    Object.keys(bookList).forEach(i => {
        if(bookList[i].title.toLowerCase() == title.toLowerCase()){
            book.push(bookList[i])
        }
    });
    res.send(book);
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
