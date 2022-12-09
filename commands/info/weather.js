require('dotenv').config();
const fetch = require('node-fetch');
const upperCaseAll = require("../../util/functions");

module.exports = {
    name: "weather",
    category: "info",
    description: "Get the daily weather for a location",
    syntax: "rb weather [city], (State Code), (County code)",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("weather");

        if(args.length < 1){
            return message.channel.send("Error: Please enter a location")
        }

        let coordRes;
        let location = args.join(" ")
        console.log(location)
    
        try {
            coordRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.WEATHER_API_KEY}`).then(res => res.json());
            if(coordRes.length === 0){
                console.log("empty")
                throw err;
            }
        }
        catch (err) {
            return message.channel.send("Error: could not find location");
        }
        
        console.log(coordRes)
        let weather;

        try {
            weather = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${coordRes[0].lat}&lon=${coordRes[0].lon}&exclude={part}&appid=${process.env.WEATHER_API_KEY}`).then(res => res.json());
            
        }
        catch (err) {
            return message.channel.send("Error: could not get weather");
        }

        console.log(weather)
    }
}