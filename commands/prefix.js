const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');
module.exports = {
    name: 'prefix',
    type: 'utility',
    usage: '&{prefix}prefix <new prefix>',
    description: 'changes the prefix of the bot',
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can run this.")
        if (args.length<1) return message.channel.send("Invalid syntax. Do `%help prefix` for more info.");
        
        await mongo().then(async mongoose =>{
            
                await serverConfig.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    prefix: args[0],
                },{
                    upsert: true
                })
            
        })
        let result = bot.serverConfig.get(message.guild.id);
        bot.serverConfig.set(message.guild.id, {
            prefix: args[0],
            suggestion: result.suggestion,
            welcome: result.welcome,
            leave: result.leave,
            modLog: result.modLog
        });
        message.channel.send(`Successfully changed the prefix to \`${args[0]}\``); 
    }
}
