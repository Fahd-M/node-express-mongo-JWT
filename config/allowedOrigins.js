const allowedOrigins = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    'http://localhost:3000'
];
 //domain name for the web app that will access the backend server itself. also include variations without the wwww 
// after development stage remove the 2nd and 3rd and leave the domain

module.exports = allowedOrigins;