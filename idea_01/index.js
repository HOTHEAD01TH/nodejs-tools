const cron = require('node-cron');
const axios = require('axios');
process.env.TZ = "Asia/Calcutta";
//...
// Your telegram URI API
const TELEGRAM_BASE_URI = process.env.TELEGRAM_API_URI

const CREDITS = ` \r\n\n
	© Bot Developed By: Salman Qureshi, hhh
	`

// Schedule tasks to be run on the server.
// Bored api @ 5PM
cron.schedule('59 17 * * *', async function() {
	const {data} = await getAxiosRaw('https://www.boredapi.com/api/activity')

	let resStr = `
	Dear Salman, if your're bored, I've an activity for you today. \r\n
	Activity: ${data.activity}. \r\n
	Type: ${data.type}. \r\n
	Info: ${data.link == '' ? 'N/A' : data.link}.
	${CREDITS}
		`
	pingTelegram(resStr);
  console.log('Notified - bored api');
});


// on this day @ 9 AM
cron.schedule('59 08 * * *', async function() {
	const d = new Date();                                const day = d.getDay()+1;                            const month = d.getMonth() + 1;
	
	const {data} = await getAxiosRaw(`https://byabbe.se/on-this-day/${month}/${day}/events.json`)
	
				
	        let resStr = `                                       Let's start today with what happened on this day back in histor:. \r\n
	        Day: ${data.date}. \r\n
	        Event: ${data.events[0].description}. \r\n
	        Year: ${data.events[0].year}. \r\n
		
		Info: ${data.events[0].wikipedia[0].wikipedia}. \r\n

		${CREDITS}`;
	
	  pingTelegram(resStr);
	  console.log('Notified - On This Day');
});


async function pingTelegram(text){
	console.log('inside telegram ping');
	return await axios.get(TELEGRAM_BASE_URI+
	encodeURIComponent(text))
	
}

async function getAxiosRaw(url){
	return await axios.get(url)
}

console.log('Cron started...');
// var dateTime = new Date();
// console.log(dateTime);
//
console.log(new Date().toString())
