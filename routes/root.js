const express = require('express');
const router = express.Router();
const path = require('path');


//regex accepted in express 
router.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// BELOW WAS JUST FOR LEARNING PURPOSES - WOULD GENERALLY REMOVE ALONG WITH THE new-page.html, subdir.js and subdir folder

// router.get('/new-page(.html)?', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
// });

// router.get('/old-page(.html)?', (req, res) => {
//     res.redirect(301, '/new-page.html'); //302 by default
// });



module.exports = router;