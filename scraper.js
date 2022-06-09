
// mysql://rvd8pk44d3y429e3:tqqwr7za0fczmnex@gmgcjwawatv599gq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/vtox5woubolsge6o
require('dotenv').config()
const puppeteer = require('puppeteer');
const mysql = require('mysql');
const teams = require('./teams.json');

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: '3306',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    multipleStatements: true
});

let team_urls = []
const team_str1 = 'https://www.baseball-reference.com/teams/'
const team_str2 = '/2022.shtml'
for (let i = 0; i < teams.length; i++) {
	let curTeam = team_str1 + teams[i].majteam + team_str2
	team_urls.push(curTeam)
}

(async () => {
    connection.query(`TRUNCATE TABLE secondLatestPitching;
        INSERT INTO secondLatestPitching SELECT * FROM latestPitching;
        TRUNCATE TABLE latestPitching;`)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.baseball-reference.com/leagues/MLB/2022-standard-batting.shtml', { waitUntil: 'networkidle2' })
    let eachPlayer = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll('#players_standard_batting tr.full_table');
        items.forEach((item) => {
            results.push({
                playerName: item.querySelector('td').innerText,
                playerID: item.querySelector('td').getAttribute('data-append-csv'),
                age: item.querySelector('td:nth-child(3)').innerText,
                tm: item.querySelector('td:nth-child(4)').innerText,
                lg: item.querySelector('td:nth-child(5)').innerText,
                G: item.querySelector('td:nth-child(6)').innerText,
                PA: item.querySelector('td:nth-child(7)').innerText,
                AB: item.querySelector('td:nth-child(8)').innerText,
                R: item.querySelector('td:nth-child(9)').innerText,
                H: item.querySelector('td:nth-child(10)').innerText,
                B2: item.querySelector('td:nth-child(11)').innerText,
                B3: item.querySelector('td:nth-child(12)').innerText,
                HR: item.querySelector('td:nth-child(13)').innerText,
                RBI: item.querySelector('td:nth-child(14)').innerText,
                SB: item.querySelector('td:nth-child(15)').innerText,
                CS: item.querySelector('td:nth-child(16)').innerText,
                BB: item.querySelector('td:nth-child(17)').innerText,
                SO: item.querySelector('td:nth-child(18)').innerText,
                TB: item.querySelector('td:nth-child(24)').innerText,
                GDP: item.querySelector('td:nth-child(25)').innerText,
                HBP: item.querySelector('td:nth-child(26)').innerText,
                SH: item.querySelector('td:nth-child(27)').innerText,
                SF: item.querySelector('td:nth-child(28)').innerText,
                IBB: item.querySelector('td:nth-child(29)').innerText
            });
        });

       return results 
    })
console.log(eachPlayer.length)

await browser.close()

})();
