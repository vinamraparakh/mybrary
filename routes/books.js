// // THIS IS THE ROUTER FILE FOR THE BOOKS
// // Searching the books by date, cover page, title etc 

// const express = require('express');
// const fs = require('fs');
// const router = express.Router();
// const Book = require('../models/book'); //Model to connect to the database
// const Author = require('../models/author');
// const multer = require('multer');
// const path = require('path');
// const { METHODS } = require('http');
// const uploadpath = path.join('public', Book.coverImageBasePath); // This is the folder where the files will be stored - PublicFolder
// const imageMimeTypes = [ 'image/jpeg', 'image/png', 'image/gif' ]; // This is the list of file types that will be allowed to be uploaded
// // file.mimetype.startsWith('image/') - This will allow only images to be uploaded SAME AS ABOVE
// const upload = multer({
//     dest: uploadpath,
//     fileFilter: (req, file, callback) => {
//         // callback(null, true); // This will allow all files to be uploaded
//         // callback(null, file.mimetype.startsWith('image/')); // This will allow only images to be uploaded
//         callback(null, imageMimeTypes.includes(file.mimetype)); // same as above

//     }
// });

// // all books route
// router.get('/', async (req, res) => {
//     // show most recent books first
//     let query = Book.find();
//     if (req.query.title != null && req.query.title != '') {
//         query = query.regex('title', new RegExp(req.query.title, 'i'));
//     }
//     if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
//         query = query.lte('publishDate', req.query.publishedBefore);
//     }
//     if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
//         query = query.gte('publishDate', req.query.publishedAfter);
//     }
//     try {
//         const books = await query.exec();
//         res.render('books/index', {
//             books: books,
//             searchOptions: req.query
//         });
//     }
//     catch {
//         res.send("Error");
//         res.redirect('/');
//     }
// });


// // add new book route
// router.get('/new', async (req, res) => {
//     // Can code it this way but the new page has to be rendered when there is an error with post method
//     // so we will use a function to simplify the process
//     renderNewPage(res, new Book());

//     // try {
//     //     const authors = await Author.find({});
//     //     res.render('books/new', { authors: authors, book: new Book() });
//     // } catch {
//     //     res.send("Error");
//     //     // res.redirect('/books');
//     // }
// });

// // create book route

// // function upload to upload a single file with the name cover given in html forms
// // the library also adds a variable to the request named file = the file being uploaded
// router.post('/', upload.single('cover'), async (req, res) => {
//     const filename = req.file != null ? req.file.filename : null; // This is the name of the file that was uploaded
//     const book = new Book({
//         title: req.body.title,
//         author: req.body.author,
//         publishDate: new Date(req.body.publishDate),
//         // req.body.publishDate is a string
//         pageCount: req.body.pageCount,
//         description: req.body.description,
//         coverImageName: filename
//     });
//     // FOR COVER FILE - CREATE FILE with cover image and save its location to the database

//     // USE A LIBRARY CALLED MULTER TO HANDLE THE FILE UPLOADS
//     try {
//         const newAuthor = await author.save();
//         // res.redirect(`books/${newAuthor.id}`);
//         res.redirect(`books`);
//     }
//     catch {
//         if (book.coverImageName != null)
//             removeBookCover(book.coverImageName);
//         renderNewPage(res, book, true);
//     }
// });


// async function renderNewPage(res, book, hasError = false) {
//     // haserroe - if it has an error then it will be true
//     try {
//         const authors = await Author.find({});
//         const params = {
//             authors: authors,
//             book: book
//         };
//         if (hasError) params.errorMessage = 'Error Creating Book';
//         res.render('books/new', params);
//     } catch {
//         res.send("Error");
//         // res.redirect('/books');
//     }
// }

// function removeBookCover(filename) {
//     // This function will remove the file from the folder
//     fs.unlink(path.join(uploadpath, filename), err => {
//         if (err) console.error(err);
//         // not for the user
//     });
// }

// module.exports = router;

const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = [ 'image/jpeg', 'image/png', 'images/gif' ]
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All Books Route
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

module.exports = router