const Bluebird = require('Bluebird')
const puppeteer = require('puppeteer');
const connection = require('./dbConnect.js');
const chalk = require('chalk')
Bluebird.promisifyAll(connection);
Bluebird.promisifyAll(puppeteer);


(async () => {
	    const browser = await puppeteer.launch();
	    const page = await browser.newPage();
	    await page.goto('https://www.spotrac.com/mlb/rankings//', { waitUntil: 'networkidle2' });
	    await page.waitForTimeout();
	    console.log(page.emitter)
	    let playerMeta =  await page.evaluate(() => {
	        let results = [];
	        let items = document.querySelectorAll('.ranklist table tr');
	        // console.log(items)
	        items.forEach((item) => {
	        	results.push(item.innerText)
	        })	       
	        return results
	    })
	    salaryObj = {}    
	    for (let i = 0; i < playerMeta.length; i++){
	    	if (playerMeta[i].match(/[A-Z_a-z]{1,20}\s[A-Z_a-z]{1,20}/) != null){
	    		salaryObj.name = playerMeta[i].match(/[A-Z_a-z]{1,20}\s[A-Z_a-z]{1,20}/)[0]
	    	}
	    	if(playerMeta[i].match(/\t[A-Z]{1,3}\t/) != null) {
	    		salaryObj.pos = playerMeta[i].match(/\t[A-Z]{1,3}\t/)[0].replaceAll('\t', '')
	    	}
	    	if(playerMeta[i].match(/\$[0-9]{1,3}/) != null){
	    		salaryObj.salary = playerMeta[i].match(/\$[0-9]{1,3}\,[0-9]{1,3}(\,[0-9]{1,3})?/)[0].replace("$", "").replaceAll(',', '')
	    	}
	    	
	    	connection.query('INSERT INTO sportrac_sals (playerName, playerPos, playerSalary)VALUES(?,?,?)', [salaryObj.name, salaryObj.pos, salaryObj.salary], function(error){
	    		if(error) throw error;
	    		console.log('Sportrac table updated')
	    	})
	    }
	    await browser.close()	
	})()






