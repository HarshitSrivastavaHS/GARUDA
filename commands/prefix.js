const mongo = require(`../mongo`);
const prefixSchema = require(`../Schemas/prefix-schema`);
module.exports = {
    name: 'prefix',
    type: 'utility',
    usage: '&{prefix}prefix <new prefix>',
    description: 'changes the prefix of the bot',
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can run this.")
        if (args.length<1) return message.channel.send("Invalid syntax. Do `%help prefix` for more info.");
        
        await mongo().then(async mongoose =>{
            
                await prefixSchema.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    prefix: args[0],
                },{
                    upsert: true
                })
            
        })
        bot.prefixes.set(message.guild.id, 
          args[0]
        )
        message.channel.send(`Successfully changed the prefix to \`${args[0]}\``); 
    }
}