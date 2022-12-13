// THIS IS THE ROUTER FILE FOR THE BOOKS
// Searching the books by date, cover page, title etc 

const express = require('express');
const router = express.Router();
const Book = require('../models/book'); //Model to connect to the database
const Author = require('../models/author');

// all books route
router.get('/', async (req, res) => {
    // show most recent books first
    res.send('All Books');
});

// add new book route
router.get('/new', async (req, res) => {
    try {
        const authors = await Author.find({});
        res.render('books/new', { authors: author, book: new Book() });
    } catch {
        res.redirect('/books');
    }
});

// create book route
router.post('/', async (req, res) => {
    res.send('Create Book');
});

module.exports = router;