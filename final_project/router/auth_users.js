const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (username) return true;
  return false;
};

const authenticatedUser = (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return user ? true : false;
};

// Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password is required" });
  }

  const existuser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!existuser) {
    return res.status(404).json({ message: "user not found" });
  }

  let accessToken = jwt.sign({ username: username }, "access", {
    expiresIn: "1h",
  });

  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Login successful!" });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: `Review for ISBN ${isbn} deleted` });
  }

  return res.status(404).json({ message: "No review found for this user" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;