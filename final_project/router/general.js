const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) { 
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
          return res.status(404).json({message: "User already exists!"});    
        }
      } 
      return res.status(404).json({message: "Unable to register user."});
    });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get all books based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    const response = {
        [`booksBy${author}`]: booksByAuthor
    };

    if (booksByAuthor.length > 0) {
        res.status(200).json(response);
    } else {
        res.status(404).json({ message: `No books found by author ${author}` });
    }
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);

    const response = {
        [`booksWithtitle ${title}`]: booksByTitle
    };

    if (booksByTitle.length > 0) {
        res.status(200).json(response);
    } else {
        res.status(404).json({ message: `No books found titled :${title}` });
    }
});
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const bookReview = books[isbn];

    if (bookReview) {
        res.send(bookReview.reviews);
    } else {
        res.status(404).json({ message: "Book not found." });
    }
});

// Get all books available with axios / promises
const getBooks = axios.get("https://manueljramir-5001.theia-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
console.log(getBooks);
getBooks.then(resp => {
    let Books = resp.data;
    console.log(JSON.stringify(Books,null,4))
})
.catch(err => {
    console.log("Error getting all books", err.toString())

});

// Get book by ISBN with axios / promises
const getISBN = axios.get("https://manueljramir-5001.theia-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/1");
console.log(getISBN);
getISBN.then(resp => {
    let book = resp.data;
    console.log((book))
})
.catch(err => {
    console.log("Error getting book by ISBN",err.toString())
 });

// Get all books based on author with axios / promises
const getAuthor = axios.get("https://manueljramir-5001.theia-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/Samuel Beckett")
console.log(getAuthor);
getAuthor.then(resp => {
    let Author = resp.data;
    console.log((Author))
})
.catch(err => {
    console.log("Error getting book by author", err.toString())

});

// Get all books based on title with axios / promises
const getTitle = axios.get("https://manueljramir-5001.theia-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/Fairy tales")
  .then(resp => {
    let book = resp.data;
    return book;
  })
  .catch(err => {
    throw err; 
  });

getTitle.then(
  (book) => console.log(book),
  (err) => console.log("Error finding title", err)
);
module.exports.general = public_users;
