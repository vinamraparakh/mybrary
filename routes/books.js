// THIS IS THE ROUTER FILE FOR THE BOOKS
// Searching the books by date, cover page, title etc 

const express = require('express');
const router = express.Router();
const Book = require('../models/book'); //Model to connect to the database

// all books route
router.get('/', async (req, res) => {
    // show most recent books first
    res.send('All Books');
});

// new book route
router.get('/new', (req, res) => {
    res.send('New Book');    
});
 
// create book route
router.post('/', async (req, res) => {
    res.send('Create Book');
});

module.exports = router;