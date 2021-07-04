const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');

module.exports = {
    name: 'setleave',
    type: 'admin',
    description: 'sets the leaves channel.',
    usage: '&{prefix}setleave <#channel>',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        if (args.length<1) return message.channel.send("Please mention the channel. ") 
        const CHANNELS_PATTERN = /<#(\d{17,19})>/g;
        const x = args[0].match(CHANNELS_PATTERN);
        if (!x) return message.channel.send(`Invalid syntax. Do \`${prefix}help setleave\` for more info.`);
        let channel_id = (args[0].replace(/<#/g,"")).replace(/>/g,"");
        const msg = await message.channel.send(`Setting <#${channel_id}> as the leave message channel.`);
        await mongo().then(async (mongoose)=>{
          
            await serverConfig.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    leave: channel_id,
                },{
                    upsert: true
                })
          
          msg.edit(`Successfully set the <#${channel_id}> as the leaves channel. Please make sure that the bot has permission to send message in that channel.`);
          let result = bot.serverConfig.get(message.guild.id);
          bot.serverConfig.set(message.guild.id, {
            prefix: result.prefix,
            suggestion: result.suggestion,
            welcome: result.welcome,
            leave: channel_id,
            modLog: result.modLog,
            ghost: result.ghost,
              autoRole: result.autoRole
          });
        })
    }
}
