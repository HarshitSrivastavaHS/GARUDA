const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');
module.exports = {
	name: 'disableghostping',
	type: 'admin',
	usage: "&{prefix}disableghostping",
	description: "Disables the ghost ping",
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
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
