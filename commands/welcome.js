const mongoose = require("mongoose");
const welcomeSchema = require(`../Schemas/welcomeSchema`);
module.exports = {
    name: 'welcome',
    type: 'utility',
    description: 'sets the welcome channel',
    async execute(message, args, bot, Discord) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can run this.")
        if (args.length<=1) return message.channel.send("Invalid syntax. Do `%help welcome` for more info.");
        
        const CHANNELS_PATTERN = /<#(\d{17,19})>/g;
        let Channel = CHANNELS_PATTERN.test(args[0]);
        if (!Channel) return message.channel.send("Please mention the channel.");
        let channelid = args[0].substr(args[0].indexOf("#")+1, args[0].indexOf(">")-2);
        
        await mongo().then(mongoose =>{
            try {
                new welcomeSchema({
                    _id: message.guild.id,
                    channelId: channelid,
                    message: args.slice(1).join(" ")
                }).save()
            }
        })
        message.channel.send(`GuildID: ${message.guild.id}\nChannelId: ${channelid}\nMessage: ${args.slice(1).join(" ")}`);     
    }
}
