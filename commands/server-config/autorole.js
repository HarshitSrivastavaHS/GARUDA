const mongo = require(`../../mongo`);
const serverConfig = require('../../Schemas/server-config');
module.exports = {
    name: 'autorole',
    usage: `&{prefix}autorole <set/remove> <@role or id>`,
    aliases: [],
    description: 'give roles automatically to the members (human only)',
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
      if (!message.member.permissions.has("MANAGE_SERVER"))
        return message.reply("You don't have the required permissions.");
      if (!args[0]||(args[0].toLowerCase()!="set"&&args[0].toLowerCase()!="remove")) return message.reply(`Invalid Syntax. ${prefix}autorole <set/remove> <role id or mention>\nRole is required only if you are setting auto role.`)
      let subcmd = args[0];
        if (subcmd.toLowerCase()=="set") {
            if (!args[1]) return message.reply(`Invalid Synatx. ${prefix}autorole set <role id or mention>`);
        let role = message.mentions.roles.first()||message.guild.roles.cache.get(args[1]);
        if (!role) return message.reply("Invalid role id or mention.");
        if (!message.guild.me.roles.highest>message.member.guild.roles.highest) return message.reply("That role is higher than the bot's role.");
        let msg = await message.channel.send("Setting autoRole");
        await mongo().then(async (mongoose)=>{
         await serverConfig.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    autoRole: role.id,
                },{
                    upsert: true
                })
          msg.edit(`AutoRole set successfully. New users would be given the role upon their joining. (Bots won't get the role)`)
          let result = bot.serverConfig.get(message.guild.id);
          bot.serverConfig.set(message.guild.id, {
            prefix: result.prefix,
            suggestion: result.suggestion,
            welcome: result.welcome,
            leave: result.leave,
            modLog: result.modLog,
            ghost: result.ghost,
            autoRole: role.id,
            goal: result.goal
          });
            
      })
        }
      else {
        let autoR = bot.serverConfig.get(message.guild.id)!=undefined?bot.serverConfig.get(message.guild.id).autoRole:undefined;
        if (!autoR) return message.channel.send("This server isn't using the autoRole feature of the bot.");
        let msg2= await message.channel.send("Disabling autorole");
        
        await mongo().then(async (mongoose)=>{
         await serverConfig.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    autoRole: undefined,
                },{
                    upsert: true
                })
          msg2.edit(`AutoRole disabled successfully.`)
          let result = bot.serverConfig.get(message.guild.id);
          bot.serverConfig.set(message.guild.id, {
            prefix: result.prefix,
            suggestion: result.suggestion,
            welcome: result.welcome,
            leave: result.leave,
            modLog: result.modLog,
            ghost: result.ghost,
            autoRole: undefined,
            goal: result.goal
          });
      })}
    }
}
