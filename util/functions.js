const fs = require("fs");

//file reader to return all files ending with ending
const getFiles = (path, ending) => {
    return fs.readdirSync(path).filter(f=> f.endsWith(ending));
}

module.exports = {
    getFiles
}