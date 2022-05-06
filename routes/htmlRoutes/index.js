const path = require('path');
const router = require('express').Router();

// ...add index.html route to server.js
router.get('/', (req, res) => {
    // ...unlike most GET and POST routes that deal with creating or return JSON data, this GET route has just one job to do, and that is to respond with an HTML page to display in the browser.
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// ...add animals.html route to server.js
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// ...add zookeepers.html route to server.js
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});
 
// ...add 'wildcard' route to server.js (in case of a route that doesn't exist)
router.get('*', (req, res) => { // '*' should be declared as the last route, otherwise it'll overwrite the others...
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;