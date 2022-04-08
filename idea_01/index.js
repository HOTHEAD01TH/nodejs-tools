const cron = require('node-cron');
const setTZ = require('set-tz');
const axios = require('axios');
require('dotenv').config();
global.helper = require('./modules/helper');
const actions = require('./modules/actions');

process.env.TZ = "Asia/Calcutta";
//...

const CREDITS = ` \r\n\n
	© Bot Developed By: Salman Qureshi, hhh
	`

	console.log('init');
	resStr = `Program strated/restarted \r\n ${new Date().toString()}`
	helper.pingTelegram(resStr);
// Schedule tasks to be run on the server.
// Bored api @ 5PM
cron.schedule('59 17 * * *', async function() {
	const {data} = await helper.getAxiosRaw('https://www.boredapi.com/api/activity')

	let resStr = `
	Dear Salman, if your're bored, I've an activity for you today. \r\n
	Activity: ${data.activity}. \r\n
	Type: ${data.type}. \r\n
	Info: ${data.link == '' ? 'N/A' : data.link}.
	${CREDITS}
		`
	helper.pingTelegram(resStr);
  console.log('Notified - bored api');
});


// on this day @ 9 AM
cron.schedule('59 08 * * *', async function() {
	setTZ('Asia/Calcutta');
	const d = new Date();                                const day = d.getDay()+1;                            const month = d.getMonth() + 1;
	
	const {data} = await helper.getAxiosRaw(`https://byabbe.se/on-this-day/${month}/${day}/events.json`)
	
				
	        let resStr = `                                       Let's start today with what happened on this day back in histor:. \r\n
	        Day: ${data.date}. \r\n
	        Event: ${data.events[0].description}. \r\n
	        Year: ${data.events[0].year}. \r\n
		
		Info: ${data.events[0].wikipedia[0].wikipedia}. \r\n

		${CREDITS}`;
	
	  helper.pingTelegram(resStr);
	  console.log('Notified - On This Day');
});

// Kashmir walla RSS @ 8 AM
cron.schedule('00 08 * * *', async function() {
	actions.getRssData('https://thekashmirwalla.com/feed/');
	console.log('Notified - Kashmir walla RSS');

})

// TechCrunch RSS @ 10 PM
cron.schedule('00 22 * * *', async function() {
	actions.getRssData('https://techcrunch.com/feed/');
	console.log('Notified - TechCrunch RSS');

})




console.log('Cron started...');
// var dateTime = new Date();
// console.log(dateTime);
//
console.log(new Date().toString())
