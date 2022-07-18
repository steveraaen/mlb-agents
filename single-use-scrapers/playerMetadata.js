const Bluebird = require('Bluebird')
const puppeteer = require('puppeteer');
const connection = require('./dbConnect.js');
// const parseContract = require('./contract-parser.js');
const chalk = require('chalk')
Bluebird.promisifyAll(connection);
Bluebird.promisifyAll(puppeteer);

const getAllPlayers = ['latestBatting', 'latestPitching']
	
	connection.queryAsync(`select latestBatting.playerId from latestBatting
	WHERE latestBatting.playerId NOT IN (SELECT playerId from meta)`).then(async (rows) =>{
//	------------------ Scrape all batters -----------------------------
	const tst =  rows.map((row) => {
		return `https://www.baseball-reference.com/players/${row.PlayerId[0]}/${row.PlayerId}.shtml`
	});
		// ------------------ Scrape selected batters -----------------------------
	// var tst = []
	var metadata = [];
	(async () => {
		let count = 0
			for(let i = 111; i < tst.length; i++) {
			count += 1
			let metaObj = {}
			metaObj.playerId = tst[i].split('/')[5].split('.')[0]	
		    const browser = await puppeteer.launch();
		    const page = await browser.newPage();
		    await page.goto(tst[i], { waitUntil: 'networkidle2' });
		    await page.waitForTimeout();
		    let playerMeta =  await page.evaluate(() => {
		        let results = [];
		        let items = document.querySelectorAll("#meta p");
		        // console.log(items)
		        items.forEach((item) => {
		        	results.push(item.innerText)
		        })	       
		        return results
		    })	    
		    for(let j = 0; j< playerMeta.length; j++) {
		    	if (playerMeta[j].match('2022 Contract Status')) {
		    		metaObj.ct = playerMeta[j].split(":")[1].trim()
		    	}    	
		    	if (playerMeta[j].match('Agents')) {
		    		metaObj.agent = playerMeta[j].split(":")[1].split('•')[0].trim()
		    	}
		    	if (playerMeta[j].match(/^School/)) {
		    		metaObj.college = playerMeta[j].split(':')[1].trim()
		    	}
		    	if (playerMeta[j].match(/\sSchool/)) {
		    		metaObj.hs = playerMeta[j].split(':')[1].trim()
		    	}
		    }
		    console.log(metaObj)
		    // connection.query('INSERT INTO autometa(playerId, contract, agent, hs, college)VALUES(?,?,?,?,?)', [metaObj.playerId, metaObj.ct, metaObj.agent, metaObj.hs, metaObj.college], function(error){
		    // 	if(error) throw error;
		    // 	console.log(chalk.yellow(`${count}) Records Added`))
		    // })
		    // if(z === 0){
		    // 	console.log(`Batting Record ${chalk.blue(i)}added`)
		    // }
		    // else if (z === 1){
		    // 	console.log(`Pitching Record ${chalk.red(i)}added`)

		    // }
		    metadata.push(metaObj)
		    await browser.close()
			}
		})()
	});





