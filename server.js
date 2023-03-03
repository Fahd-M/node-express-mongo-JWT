const express = require('express');
const app = express();
const cors = require('cors');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500; 



// custom middleware logger
app.use(logger);

//Handle options credentials check - before CORS and fetch cookies credentials requirement
app.use(credentials);

//Cross origin resource sharing
app.use(cors(corsOptions));

//Built-in middleware to handle urlencoded data(also known as form data)
//'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

//app.use('/subdir', express.static(path.join(__dirname, '/public'))); 
// Telling express to use the subdirectory ( **** NOTE: routes/api/subdir.js and views/subdir folder are just for review/learning, not used in this project)

//ROUTES
app.use('/', require('./routes/root'));
//app.use('/subdir', require('./routes/subdir'));

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

app.use('/refresh', require('./routes/refresh'));
 //this endpoint receives the cookie that has refresh token, which will issue a new access token once the previous one expires
app.use('/logout', require('./routes/logout'));


app.use(verifyJWT);  // all lines below will require the jwt
app.use('/employees', require('./routes/api/employees'));



// //Route handlers example starts here
// app.get('/hello(.html)?', (req,res, next) => {
//     console.log('Attempted to load hello.html');
//     next()
// }, (req,res) => { //uncommon to chain
//     res.send('Hello world');
// })

//     //chain route handlers used in an array 
// const one = (req, res, next) => {
//     console.log('one');
//     next();
// }
// const two = (req, res, next) => {
//     console.log('two');
//     next();
// }
// const three = (req, res, next) => {
//     console.log('three');
//     next();
// }

// app.get('/chain(.html)?', [one, two, three]);
// Route Handlers example ends here


// app.use('/') --> it is more likely used in middleware vs app.all is used in routing. Both accept regex
app.all('/*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 not found"});
    } else {
        res.type('txt').send('404 Not Found');
    }
});

//custom error handling
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))