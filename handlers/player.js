const { Player } = require("discord-music-player");

const returnPlayer = (client) => { 
    const newPlayer = new Player(client, {
        leaveOnEmpty: false,
        leaveOnEnd: false,
        deafenOnJoin: true,
    });
    return newPlayer;
}

module.exports = {
    returnPlayer
}
