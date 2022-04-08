let Parser = require('rss-parser');
const axios = require('axios');


module.exports = {
    getRssFeed: async function (url) {
       
        let parser = new Parser();
        let feed = await parser.parseURL(url);
        console.log(feed.title);
        let rssData = `==== ${feed.title} ==== \r\n`;
        let i = 0
        feed.items.forEach(item => {
            rssData += ++i +') '+item.title + ': ' + item.link + '\r\n'
        });
        
        return rssData;

    },

    pingTelegram: async function (text){
        return await axios.get(process.env.TELEGRAM_API_URI+
        encodeURIComponent(text)) 
    },

    getAxiosRaw: async function (url){
        return await axios.get(url)
    },



}