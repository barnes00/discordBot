const fs = require("fs");

const getFiles = (path, ending) => { //file reader to return all files ending with ending
    return fs.readdirSync(path).filter(f => f.endsWith(ending));
}

const textToTime = (num, unit) => { //function to convert string to numerical time
    if (unit.includes("minute")) {
        return num * 60 * 1000;
    }
    else if (unit.includes("hour")) {
        return num * 60 * 60 * 1000;
    }
    else if (unit.includes("day")) {
        return num * 24 * 60 * 60 * 1000;
    }
    else {
        return 0;
    }
}

const getGuildUserID = (mentionString) => { //extract userID from message mention
    return mentionString.includes('<@!') ? mentionString.replace('<@!', '').replace('>', '')
        : mentionString.includes('<@') ? mentionString.replace('<@', '').replace('>', '') : '';
}

const formatPokeName = (nameArr) => { //args array to api formated name string
    let forms = [...nameArr];
    forms.unshift(forms.pop())
    forms = forms.join("-").toLowerCase();

    //remove shiny
    forms = forms.replace("-shiny", "")
    //special forms
    forms = forms.replace("gigantamax", "gmax")
    //regional forms
    forms = forms.replace("alolan", "alola")
    forms = forms.replace("hisuian", "hisui")
    forms = forms.replace("galarian", "galar")

    return forms;
}

const unformatPokeName = (nameStr) => { //format api name string to regular name string
    let finalName = nameStr;
    finalName = finalName.split("-")
    finalName.push(finalName.shift())
    finalName = finalName.join(" ")

    //special forms
    finalName = finalName.replace("gmax", "gigantimax")
    //regional forms
    finalName = finalName.replace("alola", "alolan")
    finalName = finalName.replace("hisui", "hisuian")
    finalName = finalName.replace("galar", "galarian")

    return finalName;
}

const upperCaseFirst = (str) => { //make every word uppercase
    const arr = str.split(" ");

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return str2;
}

// const incrementCounter = async (client, counter) => { // increase hug/kiss counter
//     const { type, user1, user2 } = counter;
//     const query = 'INSERT INTO reminders(r_id, r_date, author_id, r_desc) VALUES(DEFAULT, $1, $2, $3) RETURNING *';
//     const values = [date, authorID, rDesc];
//     try {
//         const res = await client.dbClient.query(query, values)
//         return res.rows[0];
//     } catch (err) {
//         console.log(err.stack)
//     }
// }

module.exports = {
    getFiles,
    textToTime,
    getGuildUserID,
    formatPokeName,
    unformatPokeName,
    upperCaseFirst
}