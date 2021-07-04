const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');

module.exports = {
    name: 'disablesuggestion',
    type: 'admin',
    description: 'removes the suggestion channel.',
    aliases: [],
    usage: '&{prefix}disablesuggestion',
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
       if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        
        const msg = await message.channel.send(`Removing the suggestion channel.`);
        await mongo().then(async (mongoose)=>{
          
            await serverConfig.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    suggestion: undefined,
                },{
                    upsert: true
                })
          
          msg.edit(`Successfully disabled the suggestion channel.`);
          let result = bot.serverConfig.get(message.guild.id);
          bot.serverConfig.set(message.guild.id, {
            prefix: result.prefix,
            suggestion: undefined,
            welcome: result.welcome,
            leave: result.leave,
            modLog: result.modLog,
            ghost: result.ghost,
              autoRole: result.autoRole
            });
        })
    }
}
