const express = require('express');
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

/**
 * Register a new user
 * Validates that username and password are provided and that the user doesn't already exist
 */
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
  return res.status(200).json({ message: "User registered successfully" });
});

/**
 * Task 10 - Get all books available in the shop
 * Uses async/await with Axios to fetch the complete book list from the server
 * Returns the full books object as JSON
 */
public_users.get('/', async function (req, res) {
  try {
    // Make an asynchronous GET request to fetch all books
    const response = await axios.get('http://localhost:5000/');
    // Return the book data with a 200 OK status
    return res.status(200).json(response.data);
  } catch (e) {
    // Handle any errors that occur during the request
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/**
 * Task 11 - Get book details based on ISBN
 * Uses async/await with Axios to fetch all books, then filters by the given ISBN
 * Returns a single book object if found, or a 404 error if not found
 */
public_users.get('/isbn/:isbn', async function (req, res) {
  // Extract the ISBN from the request parameters
  const isbn = req.params.isbn;
  try {
    // Fetch all books from the server asynchronously
    const response = await axios.get("http://localhost:5000/");
    // Look up the specific book using the ISBN as the key
    const book = response.data[isbn];
    if (book) {
      // Return the matched book if found
      return res.status(200).json(book);
    }
    // Return 404 if no book matches the given ISBN
    return res.status(404).json({ message: "Book not found" });
  } catch (e) {
    // Handle any errors that occur during the request
    return res.status(500).json({ message: "Error fetching book" });
  }
});

/**
 * Task 12 - Get book details based on Author
 * Uses async/await with Axios to fetch all books, then filters by the given author name
 * decodeURIComponent handles URL-encoded spaces (e.g. "Jane%20Austen" → "Jane Austen")
 * Returns all books matching the author as a key-value object
 */
public_users.get('/author/:author', async function (req, res) {
  // Decode the author parameter to handle URL-encoded characters (e.g. %20 → space)
  const author = decodeURIComponent(req.params.author);
  try {
    // Fetch all books from the server asynchronously
    const response = await axios.get("http://localhost:5000/");
    const booksData = response.data;
    let result = {};

    // Iterate over all book keys and filter by matching author name
    Object.keys(booksData).forEach((key) => {
      if (booksData[key].author === author) {
        result[key] = booksData[key];
      }
    });

    // Return the filtered result (empty object if no match found)
    return res.status(200).json(result);
  } catch (e) {
    // Handle any errors that occur during the request
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/**
 * Task 13 - Get book details based on Title
 * Uses async/await with Axios to fetch all books, then filters by the given title
 * decodeURIComponent handles URL-encoded spaces (e.g. "Pride%20and%20Prejudice" → "Pride and Prejudice")
 * Returns all books matching the title as a key-value object
 */
public_users.get('/title/:title', async function (req, res) {
  // Decode the title parameter to handle URL-encoded characters (e.g. %20 → space)
  const title = decodeURIComponent(req.params.title);
  try {
    // Fetch all books from the server asynchronously
    const response = await axios.get("http://localhost:5000/");
    const booksData = response.data;
    let result = {};

    // Iterate over all book keys and filter by matching title
    Object.keys(booksData).forEach((key) => {
      if (booksData[key].title === title) {
        result[key] = booksData[key];
      }
    });

    // Return the filtered result (empty object if no match found)
    return res.status(200).json(result);
  } catch (e) {
    // Handle any errors that occur during the request
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/**
 * Get book reviews based on ISBN
 * Directly reads from the local books database (no async needed)
 * Returns the reviews object for the specified book
 */
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "review not found" });
});

module.exports.general = public_users;