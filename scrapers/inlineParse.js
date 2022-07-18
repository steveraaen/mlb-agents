const connection = require('./dbConnect.js');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(connection);

const parseContract = ((obj) => {
	const metaObj = {}
	metaObj.playerId = obj.playerId
	if(obj.ct.match(/^Sign/)) {
		console.log(obj.ct)
		metaObj.k_end = obj.ct.slice(12, 16)
		let k_tmpa = obj.ct.split('\,')[1]
		metaObj.k_yrs =  parseInt(/[0-9]{1,2}\sy/.exec(k_tmpa)[0])
		metaObj.k_val = parseFloat(/\$(.+?)([M|k])/.exec(k_tmpa)[1])
		if(/\$(.+?)([M|k])/.exec(k_tmpa)[2] === 'M'){
			metaObj.k_den = 1000000
		}
		else {
			metaObj.k_den = 1000
		 }
		metaObj.k_start = parseFloat(k_tmpa.split('(')[1].slice(0,2))
		metaObj.k_end =  metaObj.k_start + metaObj.k_yrs -1
		metaObj.k_tot_val = metaObj.k_val * metaObj.k_den
		metaObj.k_ann_val = parseFloat(metaObj.k_tot_val / metaObj.k_yrs).toFixed(2)
	}
	else if(obj.ct === 'Pre-Arb Eligible' || 'Not Updated' || 'Free Agent' || 'Minor League Deal'){

		metaObj.k_start = 22
		metaObj.k_end = 22
		metaObj.k_yrs = 1
		metaObj.k_ann_val = 700000
	}
	return metaObj
})
module.exports = parseContract