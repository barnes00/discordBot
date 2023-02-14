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

//calculate type matchups
const getMatchups = (typeArr) => { //take an array of types and return an array of size 2 containing string of weaknesses and resistances
    let typeNames = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
    const typeMap = new Map([
        ["normal", [001, 001, 001, 001, 001, 001, 002, 001, 001, 001, 001, 001, 001, 000, 001, 001, 001, 001]],
        ["fire", [001, 0.5, 002, 001, 0.5, 0.5, 001, 001, 002, 001, 001, 0.5, 002, 001, 001, 001, 0.5, 0.5]],
        ["water", [001, 0.5, 0.5, 002, 002, 0.5, 001, 001, 001, 001, 001, 001, 001, 001, 001, 001, 0.5, 001]],
        ["electric", [001, 001, 001, 0.5, 001, 001, 001, 001, 002, 0.5, 001, 001, 001, 001, 001, 001, 0.5, 001]],
        ["grass", [001, 002, 0.5, 0.5, 0.5, 002, 001, 002, 0.5, 002, 001, 002, 001, 001, 001, 001, 001, 001]],
        ["ice", [001, 002, 001, 001, 001, 0.5, 002, 001, 001, 001, 001, 001, 002, 001, 001, 001, 002, 001]],
        ["fighting", [001, 001, 001, 001, 001, 001, 001, 001, 001, 002, 002, 0.5, 0.5, 001, 001, 0.5, 001, 002]],
        ["poison", [001, 001, 001, 001, 0.5, 001, 0.5, 0.5, 002, 001, 002, 0.5, 001, 001, 001, 001, 001, 0.5]],
        ["ground", [001, 001, 002, 000, 002, 002, 001, 0.5, 001, 001, 001, 001, 0.5, 001, 001, 001, 001, 001]],
        ["flying", [001, 001, 001, 002, 0.5, 002, 0.5, 001, 000, 001, 001, 0.5, 002, 001, 001, 001, 001, 001]],
        ["psychic", [001, 001, 001, 001, 001, 001, 0.5, 001, 001, 001, 0.5, 002, 001, 002, 001, 002, 001, 001]],
        ["bug", [001, 002, 001, 001, 0.5, 001, 0.5, 001, 0.5, 002, 001, 001, 002, 001, 001, 001, 001, 001]],
        ["rock", [0.5, 0.5, 002, 001, 002, 001, 002, 0.5, 002, 0.5, 001, 001, 001, 001, 001, 001, 002, 001]],
        ["ghost", [000, 001, 001, 001, 001, 001, 000, 0.5, 001, 001, 001, 0.5, 001, 002, 001, 002, 001, 001]],
        ["dragon", [001, 0.5, 0.5, 0.5, 0.5, 002, 001, 001, 001, 001, 001, 001, 001, 001, 002, 001, 001, 002]],
        ["dark", [001, 001, 001, 001, 001, 001, 002, 001, 001, 001, 000, 002, 001, 0.5, 001, 0.5, 001, 002]],
        ["steel", [0.5, 002, 001, 001, 0.5, 0.5, 002, 000, 002, 0.5, 0.5, 0.5, 0.5, 001, 0.5, 001, 0.5, 0.5]],
        ["fairy", [001, 001, 001, 001, 001, 001, 0.5, 002, 001, 001, 001, 0.5, 001, 001, 000, 0.5, 002, 001]]
    ]);

    //calculate weaknesses and resistances into one map
    let typeMatchupMap = new Map();
    for (let i = 0; i < typeArr.length; i++) { // for each type
        typeMatchupArr = typeMap.get(typeArr[i]) //get the type matchups
        for (j = 0; j < 18; j++) { //iterate through to find weakness/resistances values
            if (typeMatchupArr[j] !== 001) {
                if (typeMatchupMap.has(typeNames[j])) {
                    typeMatchupMap.set(typeNames[j], typeMatchupMap.get(typeNames[j]) * typeMatchupArr[j])
                }
                else {
                    typeMatchupMap.set(typeNames[j], typeMatchupArr[j])
                }
            }
        }
    }

    //sort map into seperate arrays of weaknesses and resistances
    let weaknessArr = [];
    let resistanceArr = [];
    typeMatchupMap.forEach(function (value, type) {
        if (value > 1) {
            weaknessArr.push(upperCaseFirst(type) + " x" + value)
        }
        else if (value < 1) {
            resistanceArr.push(upperCaseFirst(type) + " x" + value)
        }
    })

    if (weaknessArr.length === 0) {
        weaknessArr.push("None")
    }
    if (resistanceArr.length === 0) {
        resistanceArr.push("None")
    }

    return [weaknessArr.join("\n"), resistanceArr.join("\n")];
}

module.exports = {
    formatPokeName,
    unformatPokeName,
    getMatchups
}