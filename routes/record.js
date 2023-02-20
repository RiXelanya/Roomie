const express = require("express");
const Routes = express.Router();
const username = "admin" ; // admin username
const password = "kouropalates" ; // admin password
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'adminroomie',
  host: 'localhost',
  database: 'roomie',
  password: 'kouropalates',
  port: 5432,
})

Routes.route("/tenants").get(async function (req, res) {
  // get tenant list
  if(req.session.user) { // check if admin has logged in
    pool.query('SELECT * FROM tenant ORDER BY room ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
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
    const id = req.body.id ;
    pool.query('INSERT INTO room (room_id, available) VALUES ($1, TRUE) RETURNING *', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Room added with ID: ${id}`)
    })
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
    const fullname = req.body.name ;
    const email = req.body.email ;
    const id = req.body.id ;
  pool.query('UPDATE room SET available = FALSE WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error ;
    }
  })
  pool.query('INSERT INTO tenant (name, email, room) VALUES ($1, $2, $3) RETURNING *', [fullname, email, id], (error, results) => {
    if (error) {
      throw error ;
    }
    response.status(201).send(`Tenant has been checked in Room ${id}`);
  })
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
  const id = req.body.id ;
  pool.query('UPDATE room SET available = TRUE WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error ;
    }
  })
  pool.query('DELETE FROM tenant WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Room ${id} has been checked out`)
  })
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
