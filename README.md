# discordBot
A multipurpose personal discord bot

# Available commands
The bot has commands for categories of: fun, info, misc, music, and pokemon

Fun commands - cat, dog, hug, poke
send randomly generated gifs and images

Info - avatar, help, ping, weather
get a user's avatar, display a help menu, ping the bot, and display current weather for any city

Misc commands - choose, emojiimage, remindme, stealemoji
commands for choosing random items from a list, emoji management, and reminders

Moderation - ban, kick, purge, timeout
purge messages and ban/timeout/kick users 

Music - clear, join, leave, nowplaying, pause, play, queue, remove, repeat, resume, shuffle, skip
basic music commands to play a queue of songs 

Pokemon - pokedex, pokemon, poketrivia
commands for displaying official/shiny artwork of all forms, basic Pokemon information including types matchup and stats, and random pokemon trivia 

# Development
The bot is created with Node.js using the Discord.js library. It uses .env to store sensitive variables and data. Handlers, events, and commands are seperated into different directories and files to improve readability. The fun, weather, and Pokemon commands utilize open APIs to retrieve images and data. Music commands were developed using the discord-player framework. 
The bot is connected to a PostgreSQL database to hold long term data like reminders, user stats, and server settings. It uses the node-postgres modules to interact with the database.
The bot can be containerized with docker to run continuously. 




