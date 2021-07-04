const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');

module.exports = {
    name: 'disableleave',
    type: 'admin',
    description: 'disables the leave command.',
    aliases: [],
    usage: '&{prefix}disableleave',
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        
        const msg = await message.channel.send(`Disabling the leave message.`);
        await mongo().then(async (mongoose)=>{
          
            await serverConfig.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    leave: undefined,
                },{
                    upsert: true
                })
          
          msg.edit(`Successfully disabled the leave message.`);
          let result = bot.serverConfig.get(message.guild.id);
          bot.serverConfig.set(message.guild.id, {
            prefix: result.prefix,
            suggestion: result.suggestion,
            welcome: result.welcome,
            leave: undefined,
            modLog: result.modLog,
            ghost: result.ghost,
              autoRole: result.autoRole
            });
        })
    }
}
