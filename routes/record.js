const express = require("express");
const Routes = express.Router();
const dbo = require("../db/conn");

const username = "admin" ; // admin username
const password = "kouropalates" ; // admin password

Routes.route("/tenants").get(async function (req, res) {
  if(req.session.user) { // check if admin has logged in
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("room")
    .find({availability: false}).sort({_id: 1}) // find all occupied room room and sort by room id
    .project({_id: 1, name: 1}) // then only show room id and tenant name
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching Tenant List");
     } else {
        res.json(result);
      }
    });
  }
  else {
    res.redirect("/login"); // accessing this page without logging in would cause redirection to login page
  }
});

Routes.route("/update/add").get(function(req, res){
  res.sendFile('add.html'); // checkin webpage
});

Routes.route("/update/add").post(function (req, res) {
  // add new room
  if(req.session.user) { // make sure admin has logged in
  const dbConnect = dbo.getDb(); // connect to database
  const matchDocument = {
    _id: req.body.id,
    availability: true
  }; // json info of the document to be modified
  dbConnect
    .collection("room")
    .insertOne(matchDocument, function (err, result) { // replace the document
      if (err) {
        res.status(400).send("Error Adding room!");
      } else {
        console.log(`Room ${req.body.id} has been added`);
        res.status(204).send();
      }
    });
  }
  else {
    res.redirect("/login"); // redirected to login if has not logged in yet
  }
});

Routes.route("/update/checkin").get(function(req, res){
  res.sendFile('checkin.html'); // checkin webpage
});

Routes.route("/update/checkin").post(function (req, res) {
  // tenant checkin
  if(req.session.user) { // make sure admin has logged in
  const dbConnect = dbo.getDb(); // connect to database
  const matchDocument = {
    _id: req.body.id,
    checkin_date: new Date(),
    name: req.body.name,
    email: req.body.email,
    availability: false
  }; // json info of the document to be modified
  const filter = {_id: req.body.id} ; // id is used to search for document to be replaced
  dbConnect
    .collection("room")
    .replaceOne(filter , matchDocument, function (err, result) { // replace the document
      if (err) {
        res.status(400).send("Error checking in!");
      } else {
        console.log(`Room ${req.body.id} has been checked in`);
        res.status(204).send();
      }
    });
  }
  else {
    res.redirect("/login"); // redirected to login if has not logged in yet
  }
});

Routes.route("/update/checkout").get(function(req, res){
  res.sendFile('checkout.html'); // the checkout html page
});

Routes.route("/update/checkout").post(function (req, res) {
  if(req.session.user) { // verify that admin has logged in
  const dbConnect = dbo.getDb(); // making connection to database
  const matchDocument = {
    _id: req.body.id,
    availability: true
  }; // the document info after checkout
  const filter = {_id: req.body.id} ; // search by room number 
  dbConnect
    .collection("room")
    .replaceOne(filter , matchDocument, function (err, result) { // replace
      if (err) {
        res.status(400).send("Error checking out");
      } else {
        console.log(`Room ${req.body.id} has been checked out`);
        res.status(204).send();
      }
    });
  }
  else {
    res.redirect("/login"); // redirect to login page if admin has not logged in 
  }
});

Routes.route('/login').get(function(req, res){
  res.sendFile('login.html'); // get the login page
});

Routes.route('/login').post(function(req, res){
  console.log(Users);
  if(!req.body.id || !req.body.password){
    res.sendFile('login.html'); // if no body and password provided then back to login 
  } else {
        if(username === req.body.username && password === req.body.password){
           req.session.user = admin;
           res.redirect('/admin'); // if correct then save session and then redirect to admin 
        }
        else {
          res.send('<p>Invalid credential <br></br><a href="/login"> go back </a></p>');
        }
  }
});

Routes.route('/logout').get(function(req, res){
  req.session.destroy(function(){
     console.log("admin has logged out.")
  }); // destroy session to log out admin
  res.redirect('/login'); // redirect to login page
});

Routes.route('/admin').get(function(req, res){
  res.sendFile('admin.html');
});

Routes.route('/').get(function(req, res){
  if(req.session.user) {
  res.redirect('/admin'); // go to admin if already logged in
  }
  else {
    res.redirect('/login'); // go to login page if not logged in yet
  }
});

module.exports = Routes; // export routes for usage by server application
