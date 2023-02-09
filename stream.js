// For larger files we may not need all data at once 
const fs = require('fs');

const rs = fs.createReadStream('./files/lorem.txt', { encoding: 'utf-8'});
// Creating a readable stream

const ws = fs.createWriteStream('./files/new-lorem.txt');
// Creating a writable stream


//listen for data coming from stream
//Method 1
// rs.on('data', (dataChunk) => {
//     ws.write(dataChunk);
// })

//Method 2: more efficient.
rs.pipe(ws);