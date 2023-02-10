// LESSON 4: NODE SERVER WITHOUT EXPRESS 
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {};

//initialize the object we want to create
const myEmitter = new Emitter();

//listening for a log
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

//Define port 
const PORT = process.env.PORT || 3600;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt'); 

        response.statusCode = 500; 
        response.end();

    }
}

//minimal server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt'); 


// Method 1 - tedious
//  let filePath;

    // if (req.url === '/' || req.url === 'index.html') {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     filePath = path.join(__dirname, 'views', 'index.html');
    //     fs.readFile(filePath, 'utf8', (err, data) => {
    //         res.send(data)
    //     })
    // }

// Method 2 - case for every value and duplicate for index.html instead of /. also tedious and not dynamic
    // let filePath;

    // switch(req.url) {
    //     case '/':
    //         res.statusCode = 200;
    //         filePath = path.join(__dirname, 'views', 'index.html');
    //         fs.readFile(filePath, 'utf8', (err, data) => {
    //             res.sendDate(data);
    //         });
    //         break;
    // }

// Method 3 - dynamic switch 
    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'text/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    //chained ternary 
    let filePath = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/' // next condition to check, accounts for subdir
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    // Still works even if about or newPage forget to write .html afterwards 
    // Makes the .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    // Check if we want to serve file. Checking to see if file exists or not, gives true or false 
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        //serve the file
        serveFile(filePath, contentType, res);

    } else {
        //404
        //301 redirect
        //console.log(path.parse(filePath));
        // if you enter a filepath that doesn't exist you get a path.parse generates a console.log like this:
        // {
        //     root: 'C:\\',
        //     dir: 'C:\\Users\\Fahd\\Desktop\\2023-projects\\node-express-mongo-1\\views',
        //     base: 'old.html',
        //     ext: '.html',
        //     name: 'old'
        // }
        switch(path.parse(filePath).base){
            case 'old-page.html' : 
                res.writeHead(301, {'Location': '/new-page.html'}) //value for header
                res.end();

                break;

            case 'www-page.html':
                case 'old-page.html' : 
                res.writeHead(301, {'Location': '/'}) //redirect to homepage
                res.end();

                break;
            default:
                // serve a 404 response
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);

        }
    }

})

server.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
