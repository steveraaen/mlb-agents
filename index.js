require('dotenv').config()
const express = require('express')
const path = require('path')
const mysql = require('mysql')
const connection = require('./scrapers/dbConnect.js');
// const get = require('./scrapers/traderumors.js');
const app = express()
// console.log(connection)
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/bigagents', function(req, res) {
  connection.query(`select distinct agent, count(playerId), avg(k_ann_val), avg(k_yrs) 
                    from meta 
                    where agent is not null
                    and k_ann_val is not null
                    group by agent 
                    order by count(playerId) desc`, function (error, results, fields) {
  	res.json(results)
    // connection.release();
    if (error) throw error;
   });
 });

app.get('/api/allagents', function(req, res) {
  connection.query('select distinct agent from meta where agent is not null order by agent', function (error, results, fields) {
    res.json(results)
    if (error) throw error;
   });
 });

const port = process.env.PORT || 5001;
app.listen(port);
console.log(`Listening on ${port}`);
// console.log(path)

