const express = require('express');
const req = require('express/lib/request');
// Create route for front-end to request data from...
const { animals } = require('./data/animals.json');

const PORT = process.env.PORT || 3001;

// instantiate...
const app = express();

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

// listen for requests... on port '3001'... there are other port options available...
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// added something temporary...