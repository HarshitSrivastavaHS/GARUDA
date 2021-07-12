const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');

module.exports = {
    name: 'ghostping',
    type: 'admin',
    description: 'sets or unsets the ghostping detection channel.',
    usage: '&{prefix}ghostping set/unset <#channel>',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("You need manage server pemission to use this command.");
        if (args.length==0) {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Ghost Ping Detection Help Menu")
            .setDescription(`**To enable**\n${prefix}ghostping set #ping-detections\n**To disable**\n${prefix}ghostping unset`)
            .setTimestamp();
            return message.channel.send(emb);
        } 
        
        if (args[0]&&args[0].toLowerCase()=="set") {
            if (args[1]&&args[1].includes(message.mentions.channels.first())) {
                let channel = message.mentions.channels.first();
                const msg = await message.channel.send(`Setting ${channel} as the ghost ping detection channel.`);
                try {
                    await channel.send("Successfully set this channel for the detection of ghostpings.");
                }
                catch (err) {
                    return msg.edit("Missing permissions in that channel");
                }
                await mongo().then(async (mongoose)=>{
              
                    await serverConfig.findOneAndUpdate({
                          _id: message.guild.id
                        },{
                            _id: message.guild.id,
                            ghost: channel.id,
                        },{
                            upsert: true
                        })
                });
                msg.edit(`Successfully set the ${channel} as the ghost ping detection channel.`);
                let result = bot.serverConfig.get(message.guild.id);
                    bot.serverConfig.set(message.guild.id, {
                    prefix: result.prefix,
                    suggestion: result.suggestion,
                    welcome: result.welcome,
                    leave: result.leave,
                    modLog: result.modLog,
                    ghost: channel.id,
                    autoRole: result.autoRole,
                    goal: result.goal
                })    
            }
            else {
                message.reply("Please mention the ghost ping detection channel.")
            }
        }
        else if (args[0]&&args[0].toLowerCase() == "unset") {
            const msg = await message.channel.send(`Disabling the ghost ping detection`);
            await mongo().then(async (mongoose)=>{
            
                await serverConfig.findOneAndUpdate({
                        _id: message.guild.id
                    },{
                        _id: message.guild.id,
                        ghost: undefined,
                    },{
                        upsert: true
                    })
            });
            msg.edit(`Successfully disabled the welcomer`);
            let result = bot.serverConfig.get(message.guild.id);
                bot.serverConfig.set(message.guild.id, {
                prefix: result.prefix,
                suggestion: result.suggestion,
                welcome: result.welcome,
                leave: result.leave,
                modLog: result.modLog,
                ghost: undefined,
                autoRole: result.autoRole,
                goal: result.goal
            })    
        }
        else {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Ghost Ping Detection Help Menu")
            .setDescription(`**To enable**\n${prefix}ghostping set #ping-detections\n**To disable**\n${prefix}ghostping unset`)
            .setTimestamp();
            message.reply("Invalid Syntax",emb)
        }
        
    }
}