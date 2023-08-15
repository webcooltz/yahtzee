// ---Imports/dependencies---
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/connect');
// ---Variables---
const PORT = process.env.PORT || 3000;
// ---App setup---
const app = express();
const server = require('http').createServer(app);
const socketSetup = require('./socketSetup');

app
  .use(express.static('public')) // Serve static files from the "public" directory
  .use(cors()) // Enable Cross Origin Resource Sharing
  .use(bodyParser.json()) // Parse requests with JSON payloads (POST requests)
  .use(logger('dev')) // Log requests to the console
  .use((req, res, next) => { // Set CORS headers on response from this API using the `res` object
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader( // Disable caching so we'll always get the latest comments
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader( // Allow GET, POST, and OPTIONS requests from specified origins
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next(); // Pass control to the next handler
  })
  .use('/', require('./routes')); // Mount our custom routes

// ---Start the server---

try {
    // Connect to MongoDB and then start the server
    mongodb.initDb((err) => {
        if (err) {
            console.log(err);
          } else {
            // Start the server
            console.log("DB Connected");
            server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            });
        }
    });

    socketSetup(server);
} catch (error) {
    console.log("Could not start server: ", error);
}
