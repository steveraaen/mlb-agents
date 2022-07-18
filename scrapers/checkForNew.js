const Bluebird = require('Bluebird')
const puppeteer = require('puppeteer');
const connection = require('./dbConnect.js');
const parseContract = require('./inlineParse')
const chalk = require('chalk')
Bluebird.promisifyAll(connection);
Bluebird.promisifyAll(puppeteer);

const getCallUps = `with pids as
(
Select playerId from latestBatting
union all
Select playerId from latestPitching
)
select * 
from pids 
where not exists (select 1 from meta where playerId = pids.playerId);`
const addCallUpsToMeta = `INSERT INTO meta
SELECT * FROM autometa`

const playerCodes = []
const urls = []

connection.queryAsync(getCallUps).then( (rows) =>{	
console.log(rows)		
		for(let i = 0; i < rows.length; i++) {
			playerCodes.push(rows[i].playerId)
		}
		for (let i = 0; i < playerCodes.length; i++) {
			urls.push(`https://www.baseball-reference.com/players/${playerCodes[i][0]}/${playerCodes[i]}.shtml`)
		}
	var metadata = [];
	(async () => {
		let count = 0
			for(let i = 0; i < urls.length; i++) {
			count += 1
			let metaObj = {}
			metaObj.playerId = urls[i].split('/')[5].split('.')[0]	
		    const browser = await puppeteer.launch();
		    const page = await browser.newPage();
		    await page.goto(urls[i], { waitUntil: 'networkidle2', timeout: 0 });
		    await page.waitForTimeout();
		    let playerMeta =  await page.evaluate(() => {
		        let results = [];
		        let items = document.querySelectorAll("#meta p");
		        let playerName = document.querySelector("#meta h1 span");
		        // let debut = document.querySelector("#meta p:nth-child(7) a")
		        // console.log(debut.innerText)
		        results.push(`name: ${playerName.innerText}`)
		        items.forEach((item) => {
		        	results.push(item.innerText)
		        })	  		            
		        return results
		    })	
		    for(let j = 0; j< playerMeta.length; j++) {
		    	if (playerMeta[j].match('Debut')) {
		    		metaObj.debut = playerMeta[j].split(":")[1].trim().match(/[A-Z_a-z]{3,10}\s[0-9]{1,2}\,\s[0-9]{4}/)[0]
		    	} 
		    	if (playerMeta[j].match(/^name/)) {
		    		metaObj.name = playerMeta[j].split(":")[1].trim()
		    		console.log(playerMeta[j].split(":")[1].trim())
		    	} 
		    	if (playerMeta[j].match('2022 Contract Status')) {
		    		metaObj.ct = playerMeta[j].split(":")[1].trim()
		    		metaObj.ctDetail = parseContract(metaObj)
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
		    // console.log(metaObj)
		    connection.query('INSERT IGNORE INTO autometa(playerId, playerName, contract, agent, hs, college, k_ann_val, k_start, k_end, k_yrs)VALUES(?,?,?,?,?,?,?,?,?,?)', 
		    	[metaObj.playerId, metaObj.name, metaObj.ct, metaObj.agent, metaObj.hs, metaObj.college,metaObj.ctDetail.k_ann_val,metaObj.ctDetail.k_start,metaObj.ctDetail.k_end, metaObj.ctDetail.k_yrs], function(error){
		    	if(error) throw error;
		    	console.log(chalk.yellow(`${count}) Records Added`))
		    })
		    metadata.push(metaObj)
		    await browser.close()
			}
		})()

	})
			
