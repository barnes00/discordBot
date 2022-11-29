# discordBot
A multipurpose personal discord bot

# Available commands
The bot has commands for categories of: fun, info, misc, music, and pokemon

Fun commands - send randomly generated gifs 

Info - display a help menu for the bot

Misc - commands for choosing random items from a list, emoji stealing, and reminders

Moderation - ban, timeout, or kick members

Music - basic music commands to play a queue of songs 

Pokemon - commands for displaying official/shiny artwork, types and matchups, stats, and trivia commands

# Development
The bot is created with Node.js using the Discord.js library. Handlers, events, and commands are seperated into different directories and files to improve readability. The fun and Pokemon commands utilize open APIs to retrieve images and data. 

# Local Copy Installation
Requirements: Have Node.js installed on the device, and have your own registered Discord bot and know its token
1. Clone the repository
2. Go to the directory where you copied the application and run the command npm install
3. Create a file called .env and copy paste the following code with your own information
```
// .env 
TOKEN=
OWNER_ID=
```
 
4. Run the command "node index.js" in the bot's directory

