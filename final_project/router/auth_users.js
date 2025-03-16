const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username":"ah123","password": "123"}];

const isValid = (username)=>{ //returns boolean
    if(users.filter(e=> e.username===username).length>0){
        return true;
    }
    return false;
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username =req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
}
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({data:password},"access",{ expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }else{
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = parseInt(req.params.isbn);
    let username = req.body.username;
    let review = req.body.review;

    if (!username || !review) {
        return res.status(400).json({ message: "Missing username or review." });
    }

    if (!isValid(username)) {
        return res.status(403).json({ message: "Invalid user." });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }
    let isNewReview = !books[isbn].reviews.hasOwnProperty(username);

    books[isbn].reviews[username] = review;

    return res.status(isNewReview ? 201 : 200).json({ 
        message: isNewReview ? "Review added!" : "Review updated!" 
    });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = parseInt(req.params.isbn);
    let username = req.body.username;

    if (!username) {
        return res.status(400).json({ message: "Username is required." });
    }

    if (!isValid(username)) {
        return res.status(403).json({ message: "Invalid user." });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!books[isbn].reviews.hasOwnProperty(username)) {
        return res.status(404).json({ message: "Review not found." });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully!" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
