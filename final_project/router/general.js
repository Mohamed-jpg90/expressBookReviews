const express = require('express');
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  let exist = users.find((user) => user.username === username);
  if (exist) {
    return res.status(409).json({ message: "user already exist" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "user registered successfully" });
});

// Task 10 - Get all books using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (e) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11 - Get book details by ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get("http://localhost:5000/");
    const book = response.data[isbn];
    if (book) return res.status(200).json(book);
    return res.status(404).json({ message: "Book not found" });
  } catch (e) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});

// Task 12 - Get book details by Author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = decodeURIComponent(req.params.author);
  try {
    const response = await axios.get("http://localhost:5000/");
    const booksData = response.data;
    let result = {};
    // Filter books matching the given author
    Object.keys(booksData).forEach((key) => {
      if (booksData[key].author === author) result[key] = booksData[key];
    });
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 13 - Get book details by Title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = decodeURIComponent(req.params.title);
  try {
    const response = await axios.get("http://localhost:5000/");
    const booksData = response.data;
    let result = {};
    // Filter books matching the given title
    Object.keys(booksData).forEach((key) => {
      if (booksData[key].title === title) result[key] = booksData[key];
    });
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "review not found" });
});

module.exports.general = public_users;