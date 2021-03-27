const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');
module.exports = {
    name: 'prefix',
    type: 'utility',
    usage: '&{prefix}prefix <new prefix>',
    description: 'changes the prefix of the bot',
    permissions: ['SEND_MESSAGES'],
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
            modLog: result.modLog,
            ghost: result.ghost
        });
        message.channel.send(`Successfully changed the prefix to \`${args[0]}\``); 
    }
}
