// create a directory (project folder)
// initialize the project
    // npm init -y
// install dependencies
    // npm i axios cheerio
// create an app.js file in the directory

// require axios, cheerio and fs
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); //sets a delay
const totalPages = 10; // total pages being scraped
const delayBetweenRequests = 2000; // time being delayed

async function scrapeQuotes() { //remember to change function name
    try {
        const quotes = []; // array of info i want
        //loop through the pages
        for (let page = 1; page <= totalPages; page++) {
            const url = `https://www.azquotes.com/top_quotes.html?p=${page}`; // url being scraped
            const { data } = await axios.get(url); // getting data
            const $ = cheerio.load(data); // $ will now load the data html 
            const listItems = $(".list-quotes li"); // loads in just the specified <li> tags of the html
            
            // each iteration this code pushes the author and title text through as an object
            // to the quotes array
            listItems.each((idx, el) => {
                const quote = { title: "", author: "" };
                quote.title = $(el).find("div.wrap-block > p > a.title").text(); // change this to get different data
                quote.author = $(el).find("div.wrap-block > div.author > a").text(); // change this to get different data
                quotes.push(quote); // pushes each quote object to the quotes array
            });

            // delay between requests so we dont bog down servers
            if (page < totalPages) {
                await delay(delayBetweenRequests);
            }
        }

        // writes the new json file
        const writeFilePromise = new Promise((resolve, reject) => {
            fs.writeFile("quotes.json", JSON.stringify(quotes, null, 2), (err) => { //change qutoes.json and the first argument in JSON.stringify to the new values
                if (err) {
                    console.error(err);
                    return;
                }
                resolve();
            });
        });

        await writeFilePromise;
        console.log("Successfully written data to file");
    } catch (err) {
        console.error(err);
    }
}

scrapeQuotes(); // remember to change the function name