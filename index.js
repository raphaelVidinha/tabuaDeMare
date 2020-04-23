const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const puppeteer = require('puppeteer');

//https://www.marinha.mil.br/chm/tabuas-de-mare
readline.question(`digite a url...   `, (url_input) => {
  
    let url = url_input;
    
    (async () => {

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url);
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

        var json = JSON.stringify(result, null, 2);
        var cidade = result[0].cidade.replace(' ', '_').replace(' ', '_').toLowerCase();
        
        fs.writeFile(`./tabuas/${cidade}.json`, json, 'utf8', function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log(`O arquivo ${cidade}.json foi criado.`);
          }
        }); 

        await browser.close();
        
    })();

  readline.close();
})