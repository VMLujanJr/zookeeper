const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals'); // imported functions
const { animals } = require('../../data/animals'); // imported Animals obj


// ...add route to listen to.
router.get('/animals', (req, res) => { // type... localhost:3001/api/animals ...in the browser
    let results = animals;

    if (req.query) {
        results = filterByQuery(req.query, results); // ...req.query checks a list of animals... while... req.params.id...
    }

    res.json(results);
    /* res.json(animals); */ // if you want to send lots of information... change 'send' to 'json' or vice versa for a short message on the console.log('Hey!');
});

// ...add new route; must come after previous route!
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals) // req.params.id checks for a single unique animal... insted of... a list of animals.

    // if no record exists for the animal being searched for... return 404 error
    if (result) {
        res.json(result);
    }
    else {
        res.send(404);
    }
});

// ...allow users of router to populate the server with data by sending data from the client side of the router to the server
router.post('/animals', (req, res) => {
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

module.exports = router;