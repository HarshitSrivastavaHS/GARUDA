const mongo = require(`../../mongo`);
const serverConfig = require('../../Schemas/server-config');

async function setRoles(guild, roles){
  await mongo().then(async (mongoose)=>{
    await serverConfig.findOneAndUpdate({
      _id: guild
    },{
      _id: guild,
      giveawayManagers: roles,
    },{
      upsert: true
    })
  });
}

module.exports = {
  name: 'gmanager',
  usage: `&{prefix}gmanager add <roleid>\n&{prefix}gmanager remove <@role>\n&{prefix}gmanager view`,
  description: 'To add/remove/view the roles which can start/end/reroll giveaways.',
  aliases: ["giveawaymanager", "groles"],
  permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
  async execute(message, args, bot, Discord, prefix) {
    if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("You need manage server pemission to use this command.");
    if (args.length==0||args[0]!="add"&&args[0]!="remove"&&args[0]!="view") {
      let emb = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("Giveaway Managers Help Menu")
        .setDescription(`**People with the roles mentioned here (maximum 2 roles) can start/end/reroll giveaways without ManageGuild permission.**\n\n**To Add a role**\n${prefix}gmanager add <@role/id>\n**To remove a role**\n${prefix}gmanager remove <@role/id>\n**To view the allowed roles**\n${prefix}gmanager view`)
        .setTimestamp();
      return message.reply({embeds:[emb]});
    } 

    if (args[0]&&args[0].toLowerCase()=="add") {
      if (args[1]) {
        let role = args[1]==`${message.mentions.roles.first()}`?message.mentions.roles.first():await message.guild.roles.fetch(args[1]);
        if (!role) return message.reply(`Cannot find the mentioned role: \`${args[1]}\``)
        let roles = bot.serverConfig.get(message.guild.id)&&bot.serverConfig.get(message.guild.id).giveaway?bot.serverConfig.get(message.guild.id).giveaway:[];
        if (roles.includes(role.id)) return message.reply("The mentioned role is already added.");
        if (roles.length>=2) return message.reply("Cannot add more than 2 giveaway roles");
        let msg = await message.reply({embeds: [
          new Discord.MessageEmbed()
          .setColor("BLUE")
          .setTitle("Adding role")
          .setTimestamp()
        ]});
        roles.push(role.id);
        setRoles(message.guild.id, roles);
        let result = bot.serverConfig.get(message.guild.id); 
        bot.serverConfig.set(message.guild.id, {
          prefix: result.prefix,
          suggestion: result.suggestion,
          welcome: result.welcome,
          leave: result.leave,
          modLog: result.modLog,
          ghost: result.ghost,
          autoRole: result.autoRole,
          goal: result.goal,
          giveaway: roles
        })
        let emb = new Discord.MessageEmbed()
          .setColor("#F67280")
          .setTitle("✅ Giveaway Manager role added successfully")
          .setDescription(`Role ${role} (\`${role}\`) added successful.`)
          .setTimestamp();
        msg.edit({embeds: [emb]}); 
      } else {
        message.reply("Please re-run the command with the role id/mention.")
      }
    } else if (args[0]&&args[0].toLowerCase()=="remove") {
      if (args[1]) {
        let role = args[1]==`${message.mentions.roles.first()}`?message.mentions.roles.first():await message.guild.roles.fetch(args[1]);
        if (!role) return message.reply(`Cannot find the mentioned role: \`${args[1]}\``)
        let roles = bot.serverConfig.get(message.guild.id)&&bot.serverConfig.get(message.guild.id).giveaway?bot.serverConfig.get(message.guild.id).giveaway:[];
        if (roles.length==0) return message.reply("No giveaway manager roles are added in this server.");
        if (!roles.includes(role.id)) return message.reply("The mentioned role is not added.");
        let msg = await message.reply({embeds: [
          new Discord.MessageEmbed()
          .setColor("BLUE")
          .setTitle("Removing role")
          .setTimestamp()
        ]});
        roles.splice(roles.indexOf(role.id),1);
        setRoles(message.guild.id, roles);
        let result = bot.serverConfig.get(message.guild.id); 
        bot.serverConfig.set(message.guild.id, {
          prefix: result.prefix,
          suggestion: result.suggestion,
          welcome: result.welcome,
          leave: result.leave,
          modLog: result.modLog,
          ghost: result.ghost,
          autoRole: result.autoRole,
          goal: result.goal,
          giveaway: roles
        })
        let emb = new Discord.MessageEmbed()
          .setColor("#F67280")
          .setTitle("✅ Giveaway Manager role removed successfully")
          .setDescription(`Role ${role} (\`${role}\`) removed successful.`)
          .setTimestamp();
        msg.edit({embeds: [emb]}); 
      } else {
        message.reply("Please re-run the command with the role id/mention.")
      }  
    } else if (args[0]&&args[0].toLowerCase()=="view") {
      let roles = bot.serverConfig.get(message.guild.id)&&bot.serverConfig.get(message.guild.id).giveaway?bot.serverConfig.get(message.guild.id).giveaway:[];
      if (roles.length==0) return message.reply("This server has no giveaway manager role.");
      let roles2 = [];
      for (let role = 0; role<roles.length; role++)
        roles2[role] = await message.guild.roles.fetch(roles[role]);
      let embed = new Discord.MessageEmbed()
        .setColor("#F67280")
        .setTitle("Giveaway Manager roles")
        .setDescription(`The following roles (except the people who have manager guild) can start/end/reroll giveaways in this server: \n${roles2.join("\n")}`)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`);
      message.reply({embeds: [embed]});
    }
  }
}
