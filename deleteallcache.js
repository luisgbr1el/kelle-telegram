/*
MIT License
Copyright (c) 2022 Luis Gabriel Araújo

---

Request Owner: https://github.com/phaticusthiccy
*/

var fs = require(
    "fs"
);
var path = require(
    "path"
);
async function deleteallcache(directory) {
    const file = directory
    fs.readdir(file, (error, files) => {
        if(error) throw new Error(error);
        for (const videos of files) {
            fs.unlink(
                path.join(
                    file, videos
                ), err => {
                    if (err) throw new Error(err)
                }
            )
        }
    })
}
module.exports = deleteallcache;