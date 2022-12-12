const express = require('express');
const router = express.Router();
const ejs = require('ejs');

router.get('/', (req, res) => {
    res.render('index');
});

// exports.module = router;
module.exports = router;