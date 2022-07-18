const puppeteer = require('puppeteer');
const connection = require('./dbConnect.js');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(connection);
Bluebird.promisifyAll(puppeteer);

connection.queryAsync(`SELECT PlayerId, contract from autometa;`).then(async (rows) =>{
const M = 1000000
const k = 1000
let idx = 0
	for (let i = 0; i < rows.length; i++) {

		let metaObj = {}		
		if (rows[i].contract.match(/^Sign/)) { 
			metaObj.k_end = rows[i].contract.slice(12, 16)
			let k_tmpa = rows[i].contract.split('\,')[1]
			metaObj.k_yrs = /[0-9]{1,2}/.exec(k_tmpa)[0]
			metaObj.k_val = /\$(.+?)([M|k])/.exec(k_tmpa)[1]

			if(/\$(.+?)([M|k])/.exec(k_tmpa)[2] === 'M'){
				metaObj.k_den = 1000000
			}
			else {
				metaObj.k_den = 1000
			 }
			metaObj.playerId = rows[i].PlayerId
			metaObj.k_start = k_tmpa.split('(')[1].slice(0,2)
			metaObj.k_yrs = parseInt(metaObj.k_yrs)
			metaObj.k_val = parseFloat(metaObj.k_val)
			metaObj.k_start = parseInt(metaObj.k_start)
			metaObj.k_end =  metaObj.k_start + metaObj.k_yrs -1
			metaObj.k_tot_val = metaObj.k_val * metaObj.k_den
			metaObj.k_ann_val = parseFloat(metaObj.k_tot_val / metaObj.k_yrs).toFixed(2)
			console.log(metaObj.k_val)
		idx += 1
		console.log(idx)
		var qry = `UPDATE autometa SET k_ann_val = ?, k_tot_val = ?, k_yrs = ?, k_start = ?, k_end = ? WHERE playerId = ?`
		var dta = [metaObj.k_ann_val, metaObj.k_tot_val, metaObj.k_yrs, metaObj.k_start , metaObj.k_end, metaObj.playerId]
		connection.query(qry, dta, function(error){
		if (error) throw error;
              console.log(`record added to db`)
		})
		}
		else{
			metaObj.k_note = rows[i].contract
		}
	}
console.log(rows.length)
});





