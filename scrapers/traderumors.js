const Bluebird = require('Bluebird')
const puppeteer = require('puppeteer');
const connection = require('./dbConnect.js');
const fs = require('fs')
Bluebird.promisifyAll(connection);
Bluebird.promisifyAll(puppeteer);

	(async  () => {
		 agentObjs = []
				    connection.queryAsync('SELECT playerName, playerID FROM latestBatting').then(async (rows) => {
		    	for (let i = 0; i < rows.length; i++){
			    		if(rows[i].playerName.match(/\*$|#/)){
			    			rows[i].playerName = rows[i].playerName.replace('*', '')
			    			rows[i].playerName = rows[i].playerName.replace('#', '')
			    			// rows[i].playerName = rows[i].playerName.split(/\s/)
			    			// rows[i].playerName = rows[i].playerName[1] + " " + rows[i].playerName[0]
			    		}
		    	}
			let agentObj = {}	
		    const browser = await puppeteer.launch();
		    const page = await browser.newPage();
		    await page.goto('https://www.mlbtraderumors.com/agencydatabase', { waitUntil: 'networkidle2' });
		    await page.waitForTimeout();
		    let playerAgent =  await page.evaluate(() => {
		        let results = [];
		        let items = document.querySelectorAll("table tbody tr");
		        
		        items.forEach((item) => {
		        	results.push(item.innerText)
		        })	       
		        return results
		    })	  
		   
var x = 0
		    for (let i = 0; i < playerAgent.length; i++) {
		    	agentObj.player = playerAgent[i].split(/\t/)[0].split(",")[1].trim() + " "+ playerAgent[i].split(/\t/)[0].split(",")[0]
		    	agentObj.player.replace(/\t/, '')
		    	agentObj.agent = playerAgent[i].split(/\t/)[1]
		    	console.log(agentObj)
		    	// connection.query('INSERT INTO tr_agents (playername, agent)VALUES(?,?)',[agentObj.player, agentObj.agent], function(error){
		    	// 	if(error) throw error
		    	// 	console.log('done')
		    	// })
		   
		    }
		    // console.log(playerAgent)
			return playerAgent
		    await browser.close()
		    })

		})()




