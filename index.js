//                                  LESSON 1 STARTS HERE:
// Read and write files
//const fs = require('fs');

// avoids the / issue in directories
//const path = require('path');

//Note: Readfile is async

//Method 1 without path
// fs.readFile('./files/starter.txt','utf-8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// })

//Method 2 with path
// fs.readFile(path.join(__dirname, 'files', 'starter.txt'),'utf-8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// })

//console.log('Hello') // this would be logged before the readfile above. 

// Notice throw error: if we get uncaught exception we must catch it. 
//Exit on uncaught errors: 
// process.on('uncaughtException', err => {
//     console.log(`There was uncaught error: ${err}`);
//     process.exit(1); //exit application
// })

//example of throwing error on purpose: if file was './files/hello.txt' then ${err} would be Error: ENOENT: no such file or directory ...

// By having each in the callback of the other it controls the order of the events. However, This is callback hell! Avoided using async await.
// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you', (err) => {
//     if (err) throw err;
//     console.log('Write complete');

//     fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n\nYes it is', (err) => { 
//   appendfile creates a file if it doesn't exist or modify existing file
//         if (err) throw err;
//         console.log('Append complete');

//         fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'newReply.txt'), (err) => {
//             if (err) throw err;
//             console.log('Rename complete');
//         })
//     })
// })
//                      LESSON 1 ENDS HERE

//                      LESSON 2 START : READ WRITE FILE SYSTEM 
// CLEANER WAY TO READ WRITE FILES:

// const fsPromises = require('fs').promises;
// const path = require('path');

// const fileOps = async () => {
//     try {
//         const data = await fsPromises.readFile(path.join(__dirname, 'files','starter.txt'), 'utf-8');
//         console.log(data);

//         await fsPromises.unlink(path.join(__dirname, 'files','starter.txt')); //unlink acts as delete

//         await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data);
//         await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNice to meet you.');
//         await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'));
        
//         const newData = await fsPromises.readFile(path.join(__dirname, 'files','promiseComplete.txt'), 'utf-8');
//         console.log(newData);

//     } catch (error) {
//         console.error(error);
//     }
// }

// fileOps();

////              LESSON 2 ENDS HERE  ///////


// LESSON 3: Event Emitter //

const logEvents = require('./logEvents');

const EventEmitter = require('events');

class Emitter extends EventEmitter {};

//initialize the object we want to create
const myEmitter = new Emitter();

// add listener for the log event
myEmitter.on('log', (msg) => logEvents(msg));

setTimeout(() => {
    //emit event
    myEmitter.emit('log', 'log event emitted!');
}, 2000);
