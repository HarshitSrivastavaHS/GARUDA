const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');

module.exports = {
    name: 'setsuggestion',
    description: 'sets the channel where suggestions will be sent',
    type: "admin",
    aliases: [],
    usage: `&{prefix}setsuggestion <suggestion channel>`,
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        if (args<1) return message.channel.send(`Invalid syntax. Do \`${prefix}help setsuggestion\` for more info.`)
        const CHANNELS_PATTERN = /<#(\d{17,19})>/g;
        const x = args[0].match(CHANNELS_PATTERN);
        if (!x) return message.channel.send(`Invalid syntax. Do \`${prefix}help setsuggestion\` for more info.`);
        let channel_id = (args[0].replace(/<#/g,"")).replace(/>/g,"");
        let msg = await message.channel.send(`Setting <#${channel_id}> as the suggestion channel.`);
        await serverConfig.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    suggestion: channel_id,
                },{
                    upsert: true
                })
          msg.edit(`Successfully set the <#${channel_id}> as the suggestion channel. Please make sure that the bot has permission to send message, add reactions as well as embed links permission in that channel.`)
          let result = bot.serverConfig.get(message.guild.id);
          bot.serverConfig.set(message.guild.id, {
            prefix: result.prefix,
            suggestion: channel_id,
            welcome: result.welcome,
            leave: result.leave,
            modLog: result.modLog,
            ghost: result.ghost,
              autoRole: result.autoRole
          });
    }
}
