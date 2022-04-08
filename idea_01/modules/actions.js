

module.exports = {
    

    getRssData: async function (url){
        helper.pingTelegram(await helper.getRssFeed(url))
    
    },
    


}