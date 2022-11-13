const fs = require("fs");

const getFiles = (path, ending) => { //file reader to return all files ending with ending
    return fs.readdirSync(path).filter(f=> f.endsWith(ending));
}

const textToTime = (num, unit) => { //function to convert string to numerical time
    if(unit.includes("minute")){
        return num * 60 * 1000;
    }
    else if(unit.includes("hour")){
        return num * 60 * 60 * 1000;
    }
    else if(unit.includes("day")){
        return num * 24 * 60 * 60 * 1000;
    }
    else{
        return 0;
    }
}

const getGuildUserID = (mentionString) => { //extract userID from message mention
    return mentionString.includes('<@!') ? mentionString.replace('<@!', '').replace('>', '')
        : mentionString.includes('<@') ? mentionString.replace('<@', '').replace('>', '') : '';       
}

module.exports = {
    getFiles,
    textToTime,
    getGuildUserID
}