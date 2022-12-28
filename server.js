if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const override = require('method-override');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')




// For users you can make a schema in models folder and import it here 

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(override('_method')); //_method is the name of the query parameter that will be used to override the method put or delete
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })); // DOCUMENTATION
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

// MONGOOSE CONNECTION
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
}).then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.log('\t \t \t console has detected an ERROR:', err.message);
});
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }); // use to connect to the database using the environment variable
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => { });

// db.once('open', () => console.log('Connected to Mongoose'));
// END OF MONGOOSE CONNECTION
// mongod does not have to be manually started

const User = require('./models/users')

run()
async function run() {
    // const hashedPassword = await bcrypt.hash("password", 10)
    // const user = new User({
    //     id: Date.now().toString(),
    //     name: "vinamra",
    //     email: "a@a",
    //     password: hashedPassword
    // })
    // await user.save().then(() => {
    //     console.log(user)
    // })
}

const initializePassport = require('./passport-config')
initializePassport(
    passport,

    async id => await User.find({ id: id })
)


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    const existingUser = await User.find({
        email: req.body.email
    })
    if (existingUser.length > 0) {
        return res.redirect('/register')
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            id: Date.now().toString(),
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        await user.save().then(() => {
            res.redirect('/login')
        })
    } catch {
        res.redirect('/register')
    }


})

// ROUTING THE FUNCTIONS
app.use('/', checkAuthenticated, indexRouter);
app.use('/authors', checkAuthenticated, authorRouter); // Add authors routes to middleware chain.
app.use('/books', checkAuthenticated, bookRouter);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}


app.listen(process.env.PORT || 3000);
console.log('Server is running http://localhost:3000'); 