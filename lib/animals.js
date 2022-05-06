const fs = require('fs');
const path = require('path');

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
        path.join(__dirname, '../data/animals.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};