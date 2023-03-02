const whitelist = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'
];
 //domain name for the web app that will access the backend server itself. also include variations without the wwww 
// after development stage remove the 2nd and 3rd and leave the domain

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin){ // if domain is in the whitelist. the || !origin is just for dev mode. 
            callback(null, true) //first parameter in callack is null(the error) and the 2nd is true (means origin will be sent back saying yes its allowed)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    optionsSuccessStatus: 200
}

module.exports = corsOptions;