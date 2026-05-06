const express = require('express');
let books = require("./booksdb.js");
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
  //Write your code here

  const { username , password } = req.body

  if(!username || !password){
    res.status(400).json({message:"username and password required"})
  }

  let exist = users.find((user)=>user.username === username )
  if(exist){
    return res.status(409).json({message : " user already exist" })
  }

users.push({username,password})

  return res.status(200).json({ message: "User registered successfully" });


});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here

  try{
  const response = await axios.get('http://localhost:8800/')
  return res.status(200).json(response.data)
  }catch(e){
    return res.status(500).json({ message: "Error fetching books" });

  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book =  books[isbn]
  if(book){
    res.status(200).json(book)
  }
  return res.status(404).json({message: "book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const auther = req.params.author
  const result = {}

  Object.keys(books).forEach((key)=>{
    if(books[key].auther === auther){
      result[key] = books[key]
     }
  })


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const title = req.params.title
  let result = {}
  Object.keys(books).forEach((key)=>{
    if(books[key].title === title){
      result[key] = books[key]
    }
  })
return res.status(200).json(result)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]
  if(book){
    res.status(200).json(book.reviews)
  }
  return res.status(404).json({message: "review not found"});
});

module.exports.general = public_users;
