// THIS IS THE ROUTER FILE FOR THE BOOKS
// Searching the books by date, cover page, title etc 

const express = require('express');
const router = express.Router();
const Book = require('../models/book'); //Model to connect to the database

// all books route
router.get('/', async (req, res) => {
    
});

// new book route
router.get('/new', (req, res) => {
    
});

// create book route
router.post('/', async (req, res) => {
    
});

module.exports = router;