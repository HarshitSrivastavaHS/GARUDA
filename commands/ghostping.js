const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');
module.exports = {
	name: 'ghostping',
	type: 'admin',
	usage: "&{prefix}ghostping #channel",
    aliases: [],
	description: "Sets the channel to send if someone ghost pings",
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
	if (!message.member.permissions.has("ADMINISTRATOR"))	return message.channel.send("You don't have the required permission to use it.");
	if (args.length<1) return message.channel.send("Wrong syntax, please mention the channel in the command.");
        let targetChannel = message.mentions.channels.first()?message.mentions.channels.first():undefined;
        if (!targetChannel) return message.channel.send("Invalid Syntax.");
        let msg = await message.channel.send("Setting the ghost ping channel.");
        await mongo().then(async (mongoose)=>{
          
            await serverConfig.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    ghost: targetChannel.id,
                },{
                    upsert: true
                })
          
          msg.edit(`Successfully set the ${targetChannel} as the ghost ping channel. Please make sure that the bot has permission to send message in that channel.`);
          let result = bot.serverConfig.get(message.guild.id);
          bot.serverConfig.set(message.guild.id, {
            prefix: result.prefix,
            suggestion: result.suggestion,
            welcome: result.welcome,
            leave: result.leave,
            modLog: result.modLog,
            ghost: targetChannel.id,
		  autoRole: result.autoRole
          });
        })
	}
};
