const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const fs = require('fs');
const puppeteer = require('puppeteer');
const { formatedNameJson } = require('./helpers/string');
const { verifyPath } = require('./helpers/path');
const { formatPath, successFileCreated } = require('./helpers/formatMessages');
const constants = require('./constants/constants');
const messages =  require('./constants/messages');

//https://www.marinha.mil.br/chm/tabuas-de-mare
readline.question(messages.TITLE, (path) => {

    (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(constants.URI);
        await page.waitFor('#block-system-main > div > div > div.view-content > div:nth-child(12)');
        
        const result = await page.evaluate(() => {
          const tbMare = [];
          const trs = document.querySelectorAll('#block-system-main > div > div > div.view-content > div:nth-child(12) > table > tbody > tr');
          
          for (let i = 0; i < trs.length; i++) {
            const tds = trs[i].getElementsByTagName('td');

            tbMare.push({title: tds[0].innerText, ficha: tds[1].getElementsByTagName('a')[0].href, localizacao: tds[2].innerText, cidade: tds[3].innerText})
          }
    
          return tbMare;
        });

        const json = JSON.stringify(result, null, 2);
        const fileName = formatedNameJson(result[0].cidade);

        verifyPath(path);
        
        fs.writeFile(formatPath(path, fileName), json, constants.UTF8, (error) => {
          error ? console.log(error) : console.log(successFileCreated(fileName));
        }); 

        await browser.close();
        
    })();

  readline.close();
})