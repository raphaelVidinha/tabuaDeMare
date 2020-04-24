const fs = require('fs');
module.exports = {
  verifyPath: (path) => {
    
    if (!fs.existsSync(`./${path}`)){
      fs.mkdirSync(`./${path}`);
      console.log(`O diretório ${path} foi criado!`);
    }

  },
}