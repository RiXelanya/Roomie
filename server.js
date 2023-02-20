const express = require("express");
const cors = require("cors");
var session = require('express-session');
// import all the required modules
const PORT = 1337; // made port 1337 as the connection port
const app = express(); // start express app

app.use(cors()); // use cors middleware
app.use(express.json()); // json parsing middleware
app.use(express.urlencoded()); // form parsing middleware
app.use(require("./routes/record")); // get route information from the routes/record.js file
app.use(session({secret: "8FA670612BEC2371"})); // session middleware to store login cookie
// Error handling
app.use(function (err, _req, res) {
  console.error(err.stack);
  res.status(500).send('An error has occured!');
});
  // start Express app
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
