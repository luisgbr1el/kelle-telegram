/*
MIT License
Copyright (c) 2022 Luis Gabriel Araújo

---

Request Owner: https://github.com/phaticusthiccy
*/

var axios = require("axios");
var fs = require("fs");

async function pipetofile(url, filename) {
    var data;
  
    var res = await axios.get(url, { responseType: "arraybuffer" }).then(() => {
      fs.writeFileSync("./src/" + filename, res.data) // Write Stream To Binary
    }).catch((error) => {
      throw new Error("There is a problem with the given link \n\nError: " + error) // Throw Error If it Fails.
    })
    
}
module.exports = pipetofile;
