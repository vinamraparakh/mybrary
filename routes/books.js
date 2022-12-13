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
        res.render('books/new', { authors: authors, book: new Book() });
    } catch {
        res.send("Error");
        // res.redirect('/books');
    }
});

// create book route
router.post('/', async (req, res) => {
    res.send('Create Book');

    const author = new Author({
        name: req.body.name
    });

    try {
        const newAuthor = await author.save();
        // res.redirect(`authors/${newAuthor.id}`);
        res.redirect(`authors`);
    }
    catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        });
    }
});

module.exports = router;