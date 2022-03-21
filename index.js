const puppeteer = require('puppeteer');
const sgMail = require('@sendgrid/mail');
const { getChrome } = require('./chrome');


async function main() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    require("dotenv").config();

    const browser = await puppeteer.connect({
        browserWSEndpoint: (await getChrome()).endpoint
    });

    const page = await browser.newPage();
    // go to wordle
    await page.goto('https://www.nytimes.com/games/wordle/index.html');
    // execute script
    const solution = await page.evaluate(_ => {
        return JSON.parse(window.localStorage.getItem('nyt-wordle-state')).solution
    });

    await browser.close();

    //send an email
    const msg = {
        to: process.env.EMAIL_TO, // Change to your recipient
        from: process.env.EMAIL_SENDER, // Change to your verified sender
        subject: 'Wordle Solution',
        text: 'Todays wordle solution is: ' + solution,
    }
    sgMail.send(msg).catch(err => {
        console.log("Error sending email " + err);
    });
};

module.exports.lambdaHandler = async (event) => {
    await main();
    return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: "Function executed successfully",
            input: event,
          },
          null,
          2
        ),
    };
}
