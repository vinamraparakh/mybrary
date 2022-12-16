const express = require('express');
const router = express.Router();
const ejs = require('ejs');

const Author = require('../models/author');
const Book = require('../models/book');

// All routers
// get all authors
router.get('/', async (req, res) => {
    let search = {};
    //get the search query from the URL - it is in the quesry of the url after the ? sign
    if (req.query.name != null && req.query.name !== '') {
        search.name = new RegExp(req.query.name, 'i');
        // regular expression is created to search for the name and not just match the string
        // i means case insensitive
    }
    if (req.query)
        try {
            const authors = await Author.find(search);
            res.render('authors/index', { authors: authors, search: req.query.name });
        } catch {
            res.redirect('/');
        }
});

// new router
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })

});

// create router
// router.post('/', (req, res) => {
//     // req.body will have the data from the form

//     // this is alot of code to create a new author
//     const author = new Author({
//         name: req.body.name
//     });
//     author.save((err, newAuthor) => {
//         if (err) {
//             res.render('authors/new', {
//                 author: author,
//                 errorMessage: 'Error creating Author'
//             });
//         } else {
//             // res.redirect(`authors/${newAuthor.id}`);
//             res.redirect(`authors`);
//         }
//         // res.send(req.body.name);
//     });

// });

// Instead of this we can use the code 
router.post('/', async (req, res) => {
    // req.body will have the data from the form
    const author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`);
        // res.redirect(`authors`);
    } catch {
        res.render('authors/new', {
            // renders the new page with the data that was entered and renders error page from partials folder
            author: author,
            errorMessage: 'Error creating Author'
        });
    }
});
// for put and delete you need to install a library called method-override
// EDIT AUTHOR ROUTE
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: req.params.id }).limit(6).exec();
        res.render('authors/show', { author: author, booksByAuthor: books });
    }
    catch (err) {
        console.log(err); // remove as it is not good practice to show errors to the user
        res.redirect('/');
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
});

module.exports = router;