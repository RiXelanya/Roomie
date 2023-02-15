const { MongoClient } = require("mongodb"); // import mongodb 
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // create mongodb client

let dbConnection; // initialize dbConnection

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) { //client tried to connect to atlas
      if (err || !db) {
        return callback(err);
      }
      dbConnection = db.db("Room_Database"); // put database Room_Database inside dbConnection
      console.log("Connection to Database succeeded");
      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  }, // this function would return database when it is called by API Handler
}; 
