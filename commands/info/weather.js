require('dotenv').config();
const fetch = require('node-fetch');
const { upperCaseFirst } = require("../../util/functions");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "weather",
    category: "info",
    description: "Get the daily weather for a location",
    syntax: "rb weather [city], (State Code), (County code)",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("weather");

        if (args.length < 1) {
            return message.channel.send("Error: Please enter a location")
        }

        //get coordinates of location string
        let coordRes;
        let location = args.join(" ")
        console.log(location)
        try {
            coordRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.WEATHER_API_KEY}`).then(res => res.json());
            if (coordRes.length === 0) {
                coordRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location},US&limit=1&appid=${process.env.WEATHER_API_KEY}`).then(res => res.json());
                if (coordRes.length === 0) {
                    console.log("empty")
                    throw err;
                }
            }
        }
        catch (err) {
            return message.channel.send("Error: could not find location");
        }

        //get weather data from coordinates
        let weather;
        try {
            weather = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${coordRes[0].lat}&lon=${coordRes[0].lon}&exclude=minutely,hourly&units=imperial&appid=${process.env.WEATHER_API_KEY}`).then(res => res.json());

        }
        catch (err) {
            return message.channel.send("Error: could not get weather");
        }

        //console.log(coordRes)
        // console.log(weather.current)
        // console.log(weather.daily[0])
        // console.log(weather.current.weather)

        //format embed title
        let titleStr = "Today's Weather in " + coordRes[0].name + ", ";
        if (coordRes[0].state !== undefined) {
            titleStr = titleStr + coordRes[0].state + ", ";
        }
        titleStr = titleStr + coordRes[0].country;

        //format weather description numb = +numb.toFixed(2);
        let weatherDesc = '';
        for (let i = 0; i < weather.current.weather.length; i++) {
            weatherDesc = weatherDesc + upperCaseFirst(weather.current.weather[i].description);
            if (weather.current.weather[i].main === "Rain" && weather.daily[0].rain !== undefined) {
                weatherDesc += `: ${+(weather.daily[0].rain / 25.4).toFixed(2)} in`
            }
            if (weather.current.weather[i].main === "Snow" && weather.daily[0].snow !== undefined) {
                weatherDesc += `: ${+(weather.daily[0].snow / 25.4).toFixed(2)} in`
            }
            weatherDesc += "\n"
        }

        //create embed
        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle(titleStr)
            .addFields(
                { name: 'Temperature', value: `Current: ${Math.round(weather.current.temp)}°F \nFeels like: ${Math.round(weather.current.feels_like)}°F \nMax: ${Math.round(weather.daily[0].temp.max)}°F \nMin: ${Math.round(weather.daily[0].temp.min)}°F` },
                { name: 'Humidity', value: `${Math.round(weather.current.humidity)}%` },
                { name: 'Wind Speed', value: `${Math.round(weather.current.wind_speed)} mph` },
                { name: 'Chance of Precipitation', value: `${weather.daily[0].pop * 100}%` },
                { name: 'Weather', value: weatherDesc }
            )
            .setThumbnail(`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`)
            .setTimestamp()

        message.channel.send({ embeds: [Embed] })
    }
}