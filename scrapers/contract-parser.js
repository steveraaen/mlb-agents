const puppeteer = require('puppeteer');
const connection = require('./dbConnect.js');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(connection);
Bluebird.promisifyAll(puppeteer);

metadata = []
connection.queryAsync(`SELECT DISTINCT PlayerId FROM latestBatting;`).then(async (rows) =>{
const tst =  rows.map((row) => {
	return `https://www.baseball-reference.com/players/${row.PlayerId[0]}/${row.PlayerId}.shtml`
});
(async () => {
		for(let i = 0; i < tst.length; i++) {
		let metaObj = {}
		metaObj.playerId = tst[i].split('/')[5].split('.')[0]		// connection.query('INSERT INTO playerMeta(id)VALUES(?)', metaObj.playerId)
	    const browser = await puppeteer.launch();
	    const page = await browser.newPage();
	    await page.goto(tst[i], { waitUntil: 'networkidle2' })
	    await page.waitForTimeout();
	    let playerMeta =  await page.evaluate(() => {
	        let results = [];
	        let items = document.querySelectorAll("#meta p")
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
	    // connection.query('INSERT INTO playerMeta(id, contract, agent, hs, college)VALUES(?,?,?,?,?)', [metaObj.playerId, metaObj.ct, metaObj.agent, metaObj.hs, metaObj.college])
	    console.log(metaObj)
	    metadata.push(metaObj)
	    await browser.close()
		}
	})()
});


