const express = require('express');

const PORT = process.env.PORT || 3001;
// instantiate...
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());
// ...instructs the server to make certain files readily available and to not gate it behind a server endpoint
app.use(express.static('public'));

// use apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// listen for requests... on port '3001'... there are other port options available...
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});