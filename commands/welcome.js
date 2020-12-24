const mongoose = require("mongoose");
const welcomeSchema = require(`${__dirname}/Schemas/welcomeSchema`);
module.exports = {
    name: 'welcome',
    type: 'utility',
    description: 'sets the welcome channel',
    async execute(message, args, bot, Discord) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can run this.")
        if (args.length<=1) return message.channel.send("Invalid syntax. Do `%help welcome` for more info.");
        let Channel = args[0];
        if (!Channel.mentions.channels) return message.channel.send("Please mention the channel.");
        let channelid = Channel.mentions.channels;
        message.channel.send(`GuildID: ${message.guild.id}\nChannelId: ${channelid}\nMessage: ${args.slice(1).join(" ")}`);
        
        
    }
}
