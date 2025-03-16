const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    let username =req.body.username;
    let password = req.body.password;
    if(!username || !password){
        return res.status(501).json({ message: `wrong input :please enter username and password correctly` });
    }
    if(users.filter(e => e.username === username).length===0){
        users.push({"username":username, "password":password});
        return res.status(201).json({message: "User added!"});
    }else{
        return res.status(502).json({message: "User already exists!"});

    }
});


public_users.get('/', async function (req, res) {
    try {
        // Simulate an async operation (e.g., fetching from an external source)
        const bookList = await new Promise((resolve) => {
            setTimeout(() => resolve(books), 1000);
        });

        res.status(200).send(`get books with axios/async \n ${JSON.stringify(books, null, 4)}`);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error });
    }
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = parseInt(req.params.isbn);
    if (!isbn) {
        return res.status(404).json({ message: `wrong input : ${isbn}` });
      }
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000); // Simulate network delay
    })
    .then(() => {
        res.send(`The book with the isbn ${isbn} is : (with axios/promise)\n ${JSON.stringify(books[isbn], null, 4)}`);
    })
    .catch((error) => {
        res.status(500).json({ message: "Error fetching books", error });
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  if (!author) {
    return res.status(400).json({ message: "Invalid author input" });
  }

  new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, 1000); // Simulate network delay
})
.then(() => {
    let booksArray = Object.values(books);
  let byAuthor = booksArray.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));

  if (byAuthor.length === 0) {
    return res.status(404).json({ message: `No books found for author: ${author}` });
  }

  return res.send(`The books by the author ${author} is : \n ${JSON.stringify(byAuthor, null, 4)}`);
})
.catch((error) => {
    res.status(500).json({ message: "Error fetching books", error });
});
  
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  if (!title) {
    return res.status(400).json({ message: "Invalid title input" });
  }

  new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, 1000); // Simulate network delay
})
.then(() => {
    let booksArray = Object.values(books);
  let bytitle = booksArray.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (bytitle.length === 0) {
    return res.status(404).json({ message: `No titles found with title: ${title}` });
  }

  return res.send(`The books with the title ${title} is : \n ${JSON.stringify(bytitle, null, 4)}`);
})
.catch((error) => {
    res.status(500).json({ message: "Error fetching books", error });
});
  
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = parseInt(req.params.isbn);

    if (!isbn) {
      return res.status(404).json({ message: `wrong input : ${isbn}` });
    }
  
    return res.send(`The book reviews for ${books[isbn].title} is : \n ${JSON.stringify(books[isbn].reviews, null, 4)}`);
});

module.exports.general = public_users;
