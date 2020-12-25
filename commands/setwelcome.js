const mongo = require(`../mongo`);
const welcomeSchema = require(`../Schemas/welcome-schema`);
module.exports = {
    name: 'setwelcome',
    type: 'utility',
    usage: '%setwelcome <channel> <welcome text>',
    description: 'sets the welcome channel',
    async execute(message, args, bot, Discord) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can run this.")
        if (args.length<=1) return message.channel.send("Invalid syntax. Do `%help welcome` for more info.");
        
        const CHANNELS_PATTERN = /<#(\d{17,19})>/g;
        let Channel = CHANNELS_PATTERN.test(args[0]);
        if (!Channel) return message.channel.send("Please mention the channel.");
        let channelid = args[0].substr(args[0].indexOf("#")+1, args[0].indexOf(">")-2);
        
        await mongo().then(async mongoose =>{
            try {
                await welcomeSchema.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    channelId: channelid,
                    text: args.slice(1).join(" ")
                },{
                    upsert: true
                })
            }
            finally {
                mongoose.connection.close();
            }
        })
        bot.welcomeChannel.set(message.guild.id, {
          welChannel: channelid,
          welMessage: args.slice(1).join(" ")
        })
        message.channel.send(`Successfully set the <#${channelid}> as the welcome channel with welcome message as ${args.slice(1).join(" ")}`);     
    }
}
