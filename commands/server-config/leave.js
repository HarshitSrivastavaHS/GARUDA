const mongo = require(`../../mongo`);
const serverConfig = require('../../Schemas/server-config');


module.exports = {
    name: 'leave',
    
    description: 'sets or unsets the leave channel.',
    usage: '&{prefix}leave set/unset <#channel>',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("You need manage server pemission to use this command.");
        if (args.length==0) {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Leave Help Menu")
            .setDescription(`**To set the leave channel**\n${prefix}leave set #bye\n**To disable the leave message**\n${prefix}leave unset`)
            .setTimestamp();
            return message.channel.send({embeds:[emb]});
        } 
        
        if (args[0]&&args[0].toLowerCase()=="set") {
            if (args[1]&&args[1].includes(message.mentions.channels.first())) {
                let channel = message.mentions.channels.first();
                const msg = await message.channel.send(`Setting ${channel} as the leave channel.`);
                try {
                    await channel.send("Successfully set this channel for the leave message.");
                }
                catch (err) {
                    return msg.edit("Missing permissions in that channel");
                }
                await mongo().then(async (mongoose)=>{
              
                    await serverConfig.findOneAndUpdate({
                          _id: message.guild.id
                        },{
                            _id: message.guild.id,
                            leave: channel.id,
                        },{
                            upsert: true
                        })
                });
                msg.edit(`Successfully set the ${channel} as the leave channel.`);
                
                
            }
            else {
                message.reply("Please mention the leave channel.")
            }
        }
        else if (args[0]&&args[0].toLowerCase() == "unset") {
            const msg = await message.channel.send(`Disabling the leave message`);
            await mongo().then(async (mongoose)=>{
            
                await serverConfig.findOneAndUpdate({
                        _id: message.guild.id
                    },{
                        _id: message.guild.id,
                        leave: undefined,
                    },{
                        upsert: true
                    })
            });
            msg.edit(`Successfully disabled the leave`);
            
        }
        else {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Leave Help Menu")
            .setDescription(`**To set the leave channel**\n${prefix}leave set #bye\n**To disable the leave message**\n${prefix}leave unset`)
            .setTimestamp();
            message.reply({content:"Invalid Syntax",embeds:[emb]})
        }
        
    }
}
