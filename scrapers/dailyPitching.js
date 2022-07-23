const puppeteer = require('puppeteer');
const connection = require('./dbConnect.js');
const confirmComplete = require('../helpers/nodemail.js')
console.log(typeof connection.state)

async function dailyPitching(nxt){
    var confirmObj= {}
    const browser = await puppeteer.launch({
            'args' : [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
});
    const page = await browser.newPage();
    await page.goto('https://www.baseball-reference.com/leagues/MLB/2022-standard-pitching.shtml', { waitUntil: 'networkidle2' })

// Don't truncate tables until browser promise resolved!!
        connection.query(`TRUNCATE TABLE secondLatestPitching;
        INSERT INTO secondLatestPitching SELECT * FROM latestPitching;
        TRUNCATE TABLE latestPitching;`)

    let eachPlayer = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll('#players_standard_pitching tr.full_table');
        items.forEach((item) => {
            results.push({
                playerName: item.querySelector('td').innerText.replace('*', '').replace('#', ''),
                playerID: item.querySelector('td').getAttribute('data-append-csv'),
                age: item.querySelector('td:nth-child(3)').innerText,
                tm: item.querySelector('td:nth-child(4)').innerText,
                lg: item.querySelector('td:nth-child(5)').innerText,
                W: item.querySelector('td:nth-child(6)').innerText,
                L: item.querySelector('td:nth-child(7)').innerText,
                G: item.querySelector('td:nth-child(10)').innerText,
                GS: item.querySelector('td:nth-child(11)').innerText,
                GF: item.querySelector('td:nth-child(12)').innerText,
                CG: item.querySelector('td:nth-child(13)').innerText,
                SHO: item.querySelector('td:nth-child(14)').innerText,
                SV: item.querySelector('td:nth-child(15)').innerText,
                IP: item.querySelector('td:nth-child(16)').innerText,
                H: item.querySelector('td:nth-child(17)').innerText,
                R: item.querySelector('td:nth-child(19)').innerText,
                HR: item.querySelector('td:nth-child(20)').innerText,
                BB: item.querySelector('td:nth-child(21)').innerText,
                IBB: item.querySelector('td:nth-child(22)').innerText,
                SO: item.querySelector('td:nth-child(23)').innerText,
                HBP: item.querySelector('td:nth-child(24)').innerText,
                BK: item.querySelector('td:nth-child(25)').innerText,
                WP: item.querySelector('td:nth-child(26)').innerText,
                BF: item.querySelector('td:nth-child(27)').innerText
            });
        });
        return results;
    })

    for (let i = 0; i < eachPlayer.length; i++) {
    connection.query(`INSERT INTO latestPitching(playerName,playerId,Age,Tm,Lg,W,L,G,GS,GF,CG,SHO,SV,IP,H,R,HR,BB,IBB,SO,HBP,BK,WP,BF)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [eachPlayer[i].playerName, eachPlayer[i].playerID, eachPlayer[i].age, eachPlayer[i].tm, eachPlayer[i].lg, eachPlayer[i].W, eachPlayer[i].L, eachPlayer[i].G, eachPlayer[i].GS, eachPlayer[i].GF, eachPlayer[i].CG, eachPlayer[i].SHO, eachPlayer[i].SV, eachPlayer[i].IP, eachPlayer[i].H, eachPlayer[i].R, eachPlayer[i].HR, eachPlayer[i].BB, eachPlayer[i].IBB, eachPlayer[i].SO, eachPlayer[i].HBP, eachPlayer[i].BK, eachPlayer[i].WP, eachPlayer[i].BF], function (error) {
          if (error) throw error;
              console.log(`Pitching record ${i} added to db`)       
       });
    }
    confirmComplete('Pitcher parsing complete')
    await browser.close()
};
dailyPitching()
module.exports = dailyPitching














