// if(process.env.NODE_ENV !== 'production') {
//     require('dotenv').parse();
// } 

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// MONGOOSE CONNECTION
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mybrary', {
    useNewUrlParser: true,
}).then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.log('\t \t \t console has detected an ERROR:', err.message);
});
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }); // use to connect to the database using the environment variable
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));
// END OF MONGOOSE CONNECTION
// mongod does not have to be manually started


// ROUTING THE FUNCTIONS
app.use('/', indexRouter);
app.use('/authors', authorRouter); // Add authors routes to middleware chain.

app.listen(process.env.PORT || 3000);
console.log('Server is running http://localhost:3000'); 