require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const dbo = require("./db/conn");
// import all mthe required modules
const PORT = process.env.PORT || 1337; // made port 1337 the default port if no port environment is set
const app = express(); // start express app

app.use(cors()); // use cors middleware
app.use(express.json()); 
app.use(require("./routes/record")); // get route information from the routes/record.js file
// Error handling
app.use(function (err, _req, res) {
  console.error(err.stack);
  res.status(500).send('An error has occured!');
});

// connect to database
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start Express app
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
