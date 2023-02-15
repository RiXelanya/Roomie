const express = require("express");
const Routes = express.Router();
const dbo = require("../db/conn");

const username = admin ; // admin username
const password = kouropalates ; // admin password

Routes.route("/tenants").get(async function (req, res) {
  if(req.session.user) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("room")
    .find({availability: false}).sort({room_id: 1}) // find all occupied room room and sort by room id
    .project({_id : 0 , room_id: 1, name: 1}) // then only show room id and tenant name
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching Tenant List");
     } else {
        res.json(result);
      }
    });
  }
  else {
    res.redirect("/login")
  }
});

Routes.route("/update/checkin").get(function(req, res){
  res.sendFile('checkin.html');
});

Routes.route("/update/checkin").post(function (req, res) {
  // tenant checkin
  if(req.session.user) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    room_id: req.body.id,
    checkin_date: new Date(),
    name: req.body.name,
    email: req.body.email,
    availability: false
  };
  const filter = {room_id: req.body.id} ;
  dbConnect
    .collection("room")
    .replaceOne(filter , matchDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error checking in!");
      } else {
        console.log(`Room ${req.body.id} has been checked in`);
        res.status(204).send();
      }
    });
  }
  else {
    res.redirect("/login")
  }
});

Routes.route("/update/checkout").get(function(req, res){
  res.sendFile('checkout.html');
});

Routes.route("/update/checkout").post(function (req, res) {
  if(req.session.user) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    room_id: req.body.id,
    availability: true
  };
  const filter = {room_id: req.body.id} ;
  dbConnect
    .collection("room")
    .replaceOne(filter , matchDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error checking out");
      } else {
        console.log(`Room ${req.body.id} has been checked out`);
        res.status(204).send();
      }
    });
  }
  else {
    res.redirect("/login")
  }
});

Routes.route('/login').get(function(req, res){
  res.sendFile('login.html');
});

Routes.route('/login').post(function(req, res){
  console.log(Users);
  if(!req.body.id || !req.body.password){
    res.sendFile('login.html');
  } else {
        if(username === req.body.username && password === req.body.password){
           req.session.user = admin;
           res.redirect('/admin');
        }
        else {
          res.send('<p>Invalid credential <br></br><a href="/login"> go back </a></p>')
        }
  }
});

Routes.route('/logout').get(function(req, res){
  req.session.destroy(function(){
     console.log("admin has logged out.")
  });
  res.redirect('/login');
});

Routes.route('/admin').get(function(req, res){
  res.sendFile('admin.html');
});

module.exports = Routes; // export routes for usage by server application
