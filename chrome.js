const launchChrome = require("@serverless-chrome/lambda");	
const superagent = require("superagent");
 
module.exports.getChrome = async () => {
    const chrome = await launchChrome({
        flags: ["--headless", "--disable-gpu", "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--window-size=1280,1696"],
    });

    const response = await superagent
        .get(`${chrome.url}/json/version`)
        .set("Content-Type", "application/json");
        
    const endpoint = response.body.webSocketDebuggerUrl;
    
    return {
        endpoint,
        instance: chrome
    };
};