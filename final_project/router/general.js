const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = parseInt(req.params.isbn);

  if (!isbn) {
    return res.status(404).json({ message: `wrong input : ${isbn}` });
  }

  return res.send(`The book with the isbn ${isbn} is : \n ${JSON.stringify(books[isbn], null, 4)}`);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  if (!author) {
    return res.status(400).json({ message: "Invalid author input" });
  }

  let booksArray = Object.values(books);
  let byAuthor = booksArray.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));

  if (byAuthor.length === 0) {
    return res.status(404).json({ message: `No books found for author: ${author}` });
  }

  return res.send(`The books by the author ${author} is : \n ${JSON.stringify(byAuthor, null, 4)}`);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  if (!title) {
    return res.status(400).json({ message: "Invalid title input" });
  }

  let booksArray = Object.values(books);
  let bytitle = booksArray.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (byAuthor.length === 0) {
    return res.status(404).json({ message: `No titles found with title: ${title}` });
  }

  return res.send(`The books with the title ${title} is : \n ${JSON.stringify(bytitle, null, 4)}`);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
