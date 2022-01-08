const mongo = require(`../../mongo`);
const serverConfig = require('../../Schemas/server-config');


module.exports = {
    name: 'suggestionchannel',
    
    description: 'sets or unsets the suggestion channel.',
    usage: '&{prefix}suggestionchannel set/unset <#channel>',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("You need manage server pemission to use this command.");
        if (args.length==0) {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Suggestion Channel Help Menu")
            .setDescription(`**To enable**\n${prefix}suggestionchannel set #suggestions\n**To disable**\n${prefix}suggestionchannel unset`)
            .setTimestamp();
            return message.channel.send({embeds:[emb]});
        } 
        
        if (args[0]&&args[0].toLowerCase()=="set") {
            if (args[1]&&args[1].includes(message.mentions.channels.first())) {
                let channel = message.mentions.channels.first();
                const msg = await message.channel.send(`Setting ${channel} as the suggestion channel.`);
                try {
                    await channel.send("Successfully set this channel for the suggestions.");
                }
                catch (err) {
                    return msg.edit("Missing permissions in that channel");
                }
                await mongo().then(async (mongoose)=>{
              
                    await serverConfig.findOneAndUpdate({
                          _id: message.guild.id
                        },{
                            _id: message.guild.id,
                            suggestion: channel.id,
                        },{
                            upsert: true
                        })
                });
                msg.edit(`Successfully set the ${channel} as the suggestion channel.`);
                
            }
            else {
                message.reply("Please mention the suggestion channel.")
            }
        }
        else if (args[0]&&args[0].toLowerCase() == "unset") {
            const msg = await message.channel.send(`Disabling the suggestion channel`);
            await mongo().then(async (mongoose)=>{
            
                await serverConfig.findOneAndUpdate({
                        _id: message.guild.id
                    },{
                        _id: message.guild.id,
                        suggestion: undefined,
                    },{
                        upsert: true
                    })
            });
            msg.edit(`Successfully disabled the suggestion channel`);
            
        }
        else {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Suggestion Channel Help Menu")
            .setDescription(`**To enable**\n${prefix}suggestionchannel set #suggestions\n**To disable**\n${prefix}suggestionchannel unset`)
            .setTimestamp();
            message.reply({content:"Invalid Syntax",embeds:[emb]})
        }
        
    }
}