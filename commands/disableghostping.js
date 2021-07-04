const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');
module.exports = {
	name: 'disableghostping',
	type: 'admin',
	usage: "&{prefix}disableghostping",
	description: "Disables the ghost ping",
    aliases: [],
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR"))	return message.channel.send("You don't have the required permission to use it.");
	    let msg = await message.channel.send("Disabling the ghost ping channel.");
        await mongo().then(async (mongoose)=>{
          
            await serverConfig.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    ghost: undefined,
                },{
                    upsert: true
                })
          
          msg.edit(`Successfully disabled the ghost ping channel/command/well idk.`);
          let result = bot.serverConfig.get(message.guild.id);
          bot.serverConfig.set(message.guild.id, {
            prefix: result.prefix,
            suggestion: result.suggestion,
            welcome: result.welcome,
            leave: result.leave,
            modLog: result.modLog,
            ghost: undefined,
	    autoRole: result.autoRole
          });
        })
	}
};
