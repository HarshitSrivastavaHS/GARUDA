const mongo = require(`../../mongo`);
const serverConfig = require('../../Schemas/server-config');

module.exports = {
    name: 'modlog',
    description: 'sets or unsets the mod log channel.',
    usage: '&{prefix}modlog set/unset <#channel>',
    aliases: ["mod-log", "mdlog"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {

        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("You need manage server pemission to use this command.");
        if (args.length==0) {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Mod Log Help Menu")
            .setDescription(`**To enable mod log**\n${prefix}modlog set #modlog\n**To disable mod log**\n${prefix}modlog unset`)
            .setTimestamp();
            return message.channel.send({embeds:[emb]});
        }

        if (args[0]&&args[0].toLowerCase()=="set") {
            if (args[1]&&args[1].includes(message.mentions.channels.first())) {
                let channel = message.mentions.channels.first();
                const msg = await message.channel.send(`Setting ${channel} for mod log.`);
                try {
                    await channel.send("Successfully set this channel for the mod log.");
                }
                catch (err) {
                    return msg.edit("Missing permissions in that channel");
                }
                await mongo().then(async (mongoose)=>{

                    await serverConfig.findOneAndUpdate({
                          _id: message.guild.id
                        },{
                            _id: message.guild.id,
                            modLog: channel.id,
                        },{
                            upsert: true
                        })
                });
                msg.edit(`Successfully set the ${channel} as the mod log channel.`);
                let result = bot.serverConfig.get(message.guild.id);
                    bot.serverConfig.set(message.guild.id, {
                    prefix: result.prefix,
                    suggestion: result.suggestion,
                    welcome: result.welcome,
                    leave: result.leave,
                    modLog: channnel.id,
                    ghost: result.ghost,
                    autoRole: result.autoRole,
                    goal: result.goal,
                    giveaway: result.giveawayManagers
                })
            }
            else {
                message.reply("Please mention the mod log channel.")
            }
        }
        else if (args[0]&&args[0].toLowerCase() == "unset") {
            const msg = await message.channel.send(`Disabling the mod log`);
            await mongo().then(async (mongoose)=>{

                await serverConfig.findOneAndUpdate({
                        _id: message.guild.id
                    },{
                        _id: message.guild.id,
                        modLog: undefined,
                    },{
                        upsert: true
                    })
            });
            msg.edit(`Successfully disabled the mod log`);
            let result = bot.serverConfig.get(message.guild.id);
                bot.serverConfig.set(message.guild.id, {
                prefix: result.prefix,
                suggestion: result.suggestion,
                welcome: result.welcome,
                leave: result.leave,
                modLog: undefined,
                ghost: result.ghost,
                autoRole: result.autoRole,
                goal: result.goal,
                giveaway: result.giveawayManagers
            })
        }
        else {
            let emb = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Mod log Help Menu")
            .setDescription(`**To set the Mod log**\n${prefix}modlog set #logs\n**To disable the mod log**\n${prefix}modlog unset`)
            .setTimestamp();
            message.reply({content:"Invalid Syntax",embeds:[emb]})
        }

    }
}
