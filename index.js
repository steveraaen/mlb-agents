require('dotenv').config()
const express = require('express')
const path = require('path')
const mysql = require('mysql')
const connection = require('./scrapers/dbConnect.js');
// const get = require('./scrapers/traderumors.js');
const app = express()
// console.log(connection)
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/latest-batting', function(req, res) {
  connection.query('select * from latestBatting', function (error, results, fields) {
  	res.json(results)
    // connection.release();
    if (error) throw error;
   });
 });

app.get('/api/contracts', function(req, res) {
  connection.query('select contract from playerMeta', function (error, results, fields) {
    // res.json(results)
    var ks = res.json(results)
    console.log(ks)

    if (error) throw error;
   });
 });


const port = process.env.PORT || 5001;
app.listen(port);
console.log(`Listening on ${port}`);
// console.log(path)

