//Main starting point of the app
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); //used to parse incoming requests
const morgan = require('morgan'); //login framework
const router = require('./router');


const app = express();

//App setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*'})); //parse as if it's json

router(app);

//Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(port);
console.log('Server listening on ', port);
