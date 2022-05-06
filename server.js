const fs = require('fs');
const path = require('path');
const express = require('express');
const req = require('express/lib/request');
// Create route for front-end to request data from...
const { animals } = require('./data/animals.json');

const PORT = process.env.PORT || 3001;

// instantiate...
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

// ...instructs the server to make certain files readily available and to not gate it behind a server endpoint
app.use(express.static('public'));

// ...filter functionality
function filterByQuery(query, animalsArray) {
    
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        }
        else {
            personalityTraitsArray = query.personalityTraits;
        }

        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // ...but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the centreies that contain the trait,
            // so at the end we'll have an array of animals that have every one
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    
    // return the filtered results
    return filteredResults;
};

// ...create new functionality; takes id and array of animals, and returns a single animal object.
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];

    return result;
}

// ...create separate function to handle taking the data from req.body and adding it to our animals.json file.
function createNewAnimal(body, animalsArray) {
    console.log(body);
    const animal = body;
    animalsArray.push(animal);

    /* This won't actually add information to animals.json. Keep in mind that whenever we use require() to import data or functionality, it's only reading the data and creating a copy of it to use in server.js. So nothing we do with the imported data will ever affect the content of the file from which that data came. */
    // ...but this should do it...
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals:animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

// ...add validation to our data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }

    return true;
}

// ...add route to listen to.
app.get('/api/animals', (req, res) => { // type... localhost:3001/api/animals ...in the browser
   let results = animals;
   
   if (req.query) {
       results = filterByQuery(req.query, results); // ...req.query checks a list of animals... while... req.params.id...
   }

   res.json(results);
    /* res.json(animals); */ // if you want to send lots of information... change 'send' to 'json' or vice versa for a short message on the console.log('Hey!');
});

// ...add new route; must come after previous route!
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals) // req.params.id checks for a single unique animal... insted of... a list of animals.

    // if no record exists for the animal being searched for... return 404 error
    if (result) {
        res.json(result);
    }
    else {
        res.send(404);
    }
});

// ...add index.html route to server.js
app.get('/', (req, res) => {
    // ...unlike most GET and POST routes that deal with creating or return JSON data, this GET route has just one job to do, and that is to respond with an HTML page to display in the browser.
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// ...add animals.html route to server.js
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// ...add zookeepers.html route to server.js
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// ...add 'wildcard' route to server.js (in case of a route that doesn't exist)
app.get('*', (req, res) => { // '*' should be declared as the last route, otherwise it'll overwrite the others...
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// ...allow users of app to populate the server with data by sending data from the client side of the app to the server
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    }
    else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
});

// listen for requests... on port '3001'... there are other port options available...
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// added something temporary...