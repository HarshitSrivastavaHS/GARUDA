const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');

module.exports = {
    name: 'welcomer',
    type: 'admin',
    description: 'sets or unsets the welcome channel.',
    usage: '&{prefix}welcomer set/unset <#channel>',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("You need manage server pemission to use this command.");
        if (args.length==0) {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Welcomer Help Menu")
            .setDescription(`**To set the welcomer**\n${prefix}welcomer set #welcome\n**To disable the welcomer**\n${prefix}welcomer unset`)
            .setTimestamp();
            return message.channel.send(emb);
        } 
        
        if (args[0]&&args[0].toLowerCase()=="set") {
            if (args[1]&&args[1].includes(message.mentions.channels.first())) {
                let channel = args[1];
                const msg = await message.channel.send(`Setting ${channel} as the welcome channel.`);
                try {
                    await channel.send("Successfully set this channel for the welcomer.");
                }
                catch (err) {
                    console.log(err);
                    return msg.edit("Missing permissions in that channel");
                }
                await mongo().then(async (mongoose)=>{
              
                    await serverConfig.findOneAndUpdate({
                          _id: message.guild.id
                        },{
                            _id: message.guild.id,
                            welcome: channel.id,
                        },{
                            upsert: true
                        })
                });
                msg.edit(`Successfully set the ${channel} as the welcome channel.`);
                let result = bot.serverConfig.get(message.guild.id);
                    bot.serverConfig.set(message.guild.id, {
                    prefix: result.prefix,
                    suggestion: result.suggestion,
                    welcome: channel.id,
                    leave: result.leave,
                    modLog: result.modLog,
                    ghost: result.ghost,
                    autoRole: result.autoRole
                })    
            }
            else {
                message.reply("Please mention the welcome channel.")
            }
        }
        else if (args[0]&&args[0].toLowerCase() == "unset") {
            const msg = await message.channel.send(`Disabling the welcomer`);
            await mongo().then(async (mongoose)=>{
            
                await serverConfig.findOneAndUpdate({
                        _id: message.guild.id
                    },{
                        _id: message.guild.id,
                        welcome: undefined,
                    },{
                        upsert: true
                    })
            });
            msg.edit(`Successfully disabled the welcomer`);
            let result = bot.serverConfig.get(message.guild.id);
                bot.serverConfig.set(message.guild.id, {
                prefix: result.prefix,
                suggestion: result.suggestion,
                welcome: undefined,
                leave: result.leave,
                modLog: result.modLog,
                ghost: result.ghost,
                autoRole: result.autoRole
            })    
        }
        else {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Welcomer Help Menu")
            .setDescription(`**To set the welcomer**\n${prefix}welcomer set #welcome\n**To disable the welcomer**\n${prefix}welcomer unset`)
            .setTimestamp();
            message.reply("Invalid Syntax",emb)
        }
        
    }
}
