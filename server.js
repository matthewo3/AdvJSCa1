console.log('Server-side code running');

const express = require('express');
const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

// serve files from the public directory
app.use(express.static('public'));

// needed to parse JSON data in the body of POST requests
app.use(bodyparser.json());

// connect to the db and start the express server
let db;

const url = 'mongodb://localhost:27017/p5';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(27017, () => {
    console.log('listening on 27017');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// after receiving a PUT request, update the database with
// the new x, y coords in the request body
app.put('/score', (req, res) => {
  console.log('Data received: ' + JSON.stringify(req.body));
  db.collection('highscores').save(req.body, {upsert: true}, (err, result) => {
    if (err) {
      return console.log(err);
    }
  });
  res.sendStatus(200); // respond to the client indicating everything was ok
});


