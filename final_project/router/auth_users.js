const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const userNames = users.username
 
if(username){
  return true
}
return false

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.



}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const {username , password} = req.body
  
  if(!username || !password){
   return res.status(400).json({message:"username and password is require"}) 
  }

  const existuser  = users.find((user)=>user.username === username && user.password === password  )

if(!existuser){
  return res.status(404).json({message :"user not found "})
}


  let accessToken= jwt.sign({username :username}, "access" ,{
  expiresIn: "1h"
})

req.session.authorization={
  accessToken,
}

  res.status(200).json({message :"user successfully logged in "})

  


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "the book is not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    // token : accessToken
  });

});


regd_users.delete("/auth/review/:isbn",(req,res)=>{

const isbn = req.params.isbn
const username = req.user.username

if(!books[isbn]){
  return res.status(404).json({message : "the book is not found" })

}
if(book[isbn].reviews[username]){
  delete books[isbn].reviews[username]
  return res.status(200).json({message:"Review Deleted succsessfully"})
}
return res.status(404).json({
  message:"no review found for this user "
})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
