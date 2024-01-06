module.exports = {
    name: "sortpoke",
    category: "pokemon",
    description: "sort by name",
    syntax: "rb sortpoke string",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("sortpoke");
        let listNames = args.join(" ");
        listNames = listNames.split(",");
        listNames = listNames.map(string => string.trim())
        listNames.sort();
      
        let listString = listNames[0];
        let startChar = listNames[0].charAt(0);
        listNames.forEach(element => {
            if(element != listNames[0]){
                if(element.charAt(0) == startChar){
                    listString += `, ${element}`;
                }
                else{
                    listString += `\n${element}`;
                }
                startChar = element.charAt(0);
            }
        });

        message.channel.send(`${listString}`)
    }
}