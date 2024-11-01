const puppeteer = require('puppeteer');
const axios = require('axios');

let browser = null;
const launchBrowser = async () => {
    try {
        console.log("Launching browser started...");
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
        console.log("Launching browser successfuly");
        return
    } catch (error) {
        console.error("Failed to launch browser");
    }
}
launchBrowser()
const getInformationFromUrl = async (url) => {
    const infoObject = {}
    if (!browser) return infoObject
    const page = await browser.newPage();

    console.log(`puppeteer opening... ${url} Time ${new Date().toLocaleTimeString()}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log(`puppeteer opened ${url} Time ${new Date().toLocaleTimeString()}`);
    try {
        infoObject.title = await page.evaluate(() => document.title)

        // Get the content of the meta tags
        infoObject.meta = await page.evaluate(() => {
            const metaTags = [];
            const metaElements = document.querySelectorAll('meta');
            metaElements.forEach(element => {
                const content = element.getAttribute('content');
                metaTags.push(content);
            });
            return JSON.stringify(metaTags);
        });

        // Get the content of all the strong tags
        infoObject.strongTags = await page.evaluate(() => {
            const strongTags = [];
            const strongElements = document.querySelectorAll('strong');
            strongElements.forEach(element => {
                const content = element.textContent;
                strongTags.push(content);
            });
            return JSON.stringify(strongTags);
        });

        // Get the h1 tag of the page
        infoObject.h1 = await page.evaluate(() => {
            const h1Element = document.querySelector('h1');
            return h1Element ? h1Element.textContent : null;
        });
        // Get the h1 tag of the page
        infoObject.h2 = await page.evaluate(() => {
            const con = [];
            const elements = document.querySelectorAll('h2');
            elements.forEach(element => {
                const content = element.textContent;
                con.push(content);
            });
            return JSON.stringify(con);
        });
        // Get the h1 tag of the page
        infoObject.h3 = await page.evaluate(() => {
            const con = [];
            const elements = document.querySelectorAll('h3');
            elements.forEach(element => {
                const content = element.textContent;
                con.push(content);
            });
            return JSON.stringify(con);
        });

        console.log(`information of the URL: ${url},: `, infoObject)
        // Close the browser instance
        page.close();
        console.log(`puppeteer closed ${url} Time ${new Date().toLocaleTimeString()}`);
        return infoObject;
    } catch (error) {
        console.error(`puppeteer error from page: ${url} and error message: `, error.message);
        return null
    }
}
const queryUrl = async (url, query) => {
    const page = await browser.newPage();
    return new Promise(async (resolve, reject) => {
        try {
            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Timeout exceeded'));
                }, 5000);
            });
            // scarping data from the url
            const navigationPromise = page.goto(url);
            await Promise.race([navigationPromise, timeoutPromise]);

            const text = await page.$eval('body', element => element.innerText);
            // searching for the best match
            const result = await axios.post(`${process.env.QUERY_PDF_URL}/query-text`, {
                n: 10,
                query,
                text,
                word_length: 200,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key':process.env.QUERY_PDF_KEY
                }
            });
            page.close();
            resolve(result.data[`top_${10}_chunks`] || [])
        } catch (error) {
            console.error(error);
            page.close();
            resolve([])
        }
    })
}

module.exports = { getInformationFromUrl, queryUrl }