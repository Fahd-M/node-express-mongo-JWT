const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin){ // if domain is in the whitelist. the || !origin is just for dev mode. 
            callback(null, true) //first parameter in callack is null(the error) and the 2nd is true (means origin will be sent back saying yes its allowed)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    optionsSuccessStatus: 200
}

module.exports = corsOptions;