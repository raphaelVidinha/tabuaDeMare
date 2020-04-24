const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const fs = require('fs');
const puppeteer = require('puppeteer');
const { formatedNameJson } = require('./helpers/string');
const { verifyPath } = require('./helpers/path');

//https://www.marinha.mil.br/chm/tabuas-de-mare
readline.question(`Adicione o nome do diretório que quer salvar o arquivo: `, (path) => {
  
    let url = 'https://www.marinha.mil.br/chm/tabuas-de-mare';
    
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
        var fileName = formatedNameJson(result[0].cidade);

        verifyPath(path);
        
        fs.writeFile(`./${path}/${fileName}`, json, 'utf8', function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log(`O arquivo ${fileName} foi criado.`);
          }
        }); 

        await browser.close();
        
    })();

  readline.close();
})