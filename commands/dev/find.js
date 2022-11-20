module.exports = {
    name: "find",
    category: "dev",
    description: "",
    syntax: "",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("find");


        if (args) {
            let users = await message.guild.members.fetch({ query: args[0] })
            console.log(users.size)
            console.log(user.at(0).user.id)
            // for (const member of users) {
            //     const {id, username, discriminator} = member[1].user
            //     console.log(id, username, discriminator)
            //   }
        }

    }
}