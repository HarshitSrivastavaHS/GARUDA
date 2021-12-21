const mongo = require(`../../mongo`);
const serverConfig = require('../../Schemas/server-config');
const serverConfigurator = require('../../functions/serverConfig');
module.exports = {
    name: 'prefix',
    type: 'utility',
    usage: '&{prefix}prefix <new prefix>',
    aliases: ["setprefix"],
    description: 'changes the prefix of the bot',
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("You do not have the required permission (Manage Server)")
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
        
        await serverConfigurator(bot, message.guild.id);
        message.channel.send(`Successfully changed the prefix to \`${args[0]}\``); 
    }
}
