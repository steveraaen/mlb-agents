const connection = require('./dbConnect.js');
const Bluebird = require('Bluebird')
Bluebird.promisifyAll(connection);

function makeYesterday() {
	connection.query(`TRUNCATE TABLE oneDayBatting;
	INSERT INTO oneDayBatting(playerName,playerID,age,tm,lg,G,PA,AB,R,H,B2,B3,HR,RBI,SB,CS,BB,SO,TB,GDP,HBP,SH,SF,IBB) 
				SELECT
				latestBatting.playerName,
				latestBatting.playerID,
				latestBatting.age,      
				latestBatting.tm,
				latestBatting.lg,
				SUM(latestBatting.G - secondLatestBatting.G) as G,
				SUM(latestBatting.PA - secondLatestBatting.PA) as PA,
				SUM(latestBatting.AB - secondLatestBatting.AB) as AB,
				SUM(latestBatting.R - secondLatestBatting.R) as R,
				SUM(latestBatting.H - secondLatestBatting.H) as H,
				SUM(latestBatting.B2 - secondLatestBatting.B2) as B2,
				SUM(latestBatting.B3 - secondLatestBatting.B3) as B3,
				SUM(latestBatting.HR - secondLatestBatting.HR) as HR,
				SUM(latestBatting.RBI - secondLatestBatting.RBI) as RBI,
				SUM(latestBatting.SB - secondLatestBatting.SB) as SB,
				SUM(latestBatting.CS - secondLatestBatting.CS) as CS,
				SUM(latestBatting.BB - secondLatestBatting.BB) as BB,
				SUM(latestBatting.SO - secondLatestBatting.SO) as SO,
				SUM(latestBatting.TB - secondLatestBatting.TB) as TB,
				SUM(latestBatting.GDP - secondLatestBatting.GDP) as GDP,
				SUM(latestBatting.HBP - secondLatestBatting.HBP) as HBP,
				SUM(latestBatting.SH - secondLatestBatting.SH) as SH,
				SUM(latestBatting.SF - secondLatestBatting.SF) as SF,
				SUM(latestBatting.IBB - secondLatestBatting.IBB) as IBB
				FROM latestBatting, secondLatestBatting
				WHERE latestBatting.playerID = secondLatestBatting.playerID
				group by latestBatting.playerID;

	TRUNCATE TABLE oneDayPitching;
	INSERT INTO oneDayPitching(playerName,playerID,age,tm,lg,W,L,G,GS,GF,CG,SHO,SV,IP,H,R,HR,BB,IBB,SO,HBP,BK,WP)
 				SELECT
 				latestPitching.playerName,
	            latestPitching.playerID,
	            latestPitching.age,	            
	            latestPitching.tm as TM,
	            latestPitching.lg as LG,
	            SUM(latestPitching.W - secondLatestPitching.W) as W,
	            SUM(latestPitching.L - secondLatestPitching.L) as L,
	            SUM(latestPitching.G - secondLatestPitching.G) as G,
	            SUM(latestPitching.GS - secondLatestPitching.GS) as GS,
	            SUM(latestPitching.GF - secondLatestPitching.GF) as GF,
	            SUM(latestPitching.CG - secondLatestPitching.CG) as CG,
	            SUM(latestPitching.SHO - secondLatestPitching.SHO) as SHO,
	            SUM(latestPitching.SV - secondLatestPitching.SV) as SV,
	            SUM(latestPitching.IP - secondLatestPitching.IP) as IP,
	            SUM(latestPitching.H - secondLatestPitching.H) as H,
	            SUM(latestPitching.R - secondLatestPitching.R) as R,
	            SUM(latestPitching.HR - secondLatestPitching.HR) as HR,
	            SUM(latestPitching.BB - secondLatestPitching.BB) as BB,
	            SUM(latestPitching.IBB - secondLatestPitching.BB) as IBB,
	            SUM(latestPitching.SO - secondLatestPitching.SO) as SO,
	            SUM(latestPitching.HBP - secondLatestPitching.HBP) as HBP,
	            SUM(latestPitching.BK - secondLatestPitching.BK) as BK,
	            SUM(latestPitching.WP - secondLatestPitching.WP) as WP
	            FROM latestPitching, secondLatestPitching
	            WHERE latestPitching.playerID = secondLatestPitching.playerID
	            group by latestPitching.playerID;`,  function (error) {
	if (error) throw error;
	console.log(`record added to db`)       
	});
}
makeYesterday()

