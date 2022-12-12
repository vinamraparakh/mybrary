const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const Author = require('../models/author');

// All routers
router.get('/', (req, res) => {
    res.render('authors/index');
});

// new router
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
});

// create router
router.post('/', (req, res) => {
    res.send('Create');
});

module.exports = router;