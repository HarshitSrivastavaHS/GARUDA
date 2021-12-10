const afkConfig = require('../Schemas/afk');
const mongo = require(`../mongo`);
const Discord = require("discord.js")
module.exports = {
	name: 'messageCreate',
  async execute(message) {
    let bot = message.client;
    let prefix;
		if (message.author.bot&&!bot.allowedBots.includes(message.author.id)) return;

	  if (message.channel.type === 'dm') {
		  return;
	  }

    if (bot.afk.has(message.author.id)) {
      message.reply("Welcome back! I have cleared your AFK");
      bot.afk.delete(message.author.id);
	    await mongo().then(async (mongoose)=>{    
        await afkConfig.findOneAndRemove({
          _id: message.author.id
        })
      })
    }

    if (message.mentions.members.size>0) {
      let mentions = message.mentions.members;
      let arr = []
      mentions.forEach((item, index)=>{
        let mention = item;
        let afkStatus = bot.afk.get(mention.user.id);
        if (afkStatus)
          arr.push(`${mention.user.username} is AFK. Message: ${afkStatus.msg} - <t:${afkStatus.time}:R>`);
      })
      if (arr.length>0)
        message.channel.send(arr.join("\n"));
    }

	  prefix = bot.serverConfig.get(message.guild.id)!=undefined?bot.serverConfig.get(message.guild.id).prefix:undefined;
	  if (!prefix) {
      let result = bot.serverConfig.get(message.guild.id);
      bot.serverConfig.set(message.guild.id, {
        prefix: "%",
        suggestion: result?result.suggestion:undefined,
        welcome: result?result.welcome:undefined,
        leave: result?result.leave:undefined,
        modLog: result?result.modLog:undefined,
		    ghost: result?result.ghost:undefined,
        autoRole: result?result.autoRole:undefined,
        goal: result?result.goal:undefined,
        giveaway: result?result.giveaway:undefined
      });
      prefix = "%";
	  }
    
    prefix = prefix.toLowerCase();

    if (message.content.startsWith(`<@!${bot.user.id}>`)||message.content.startsWith(`<@${bot.user.id}>`)) {
      if (message.content.trim() == `<@!${bot.user.id}>` || message.content.trim() == `<@${bot.user.id}>`)
        return message.reply(`My prefix in this server is \`${prefix}\`. You can also ping me for running a command, eg: <@${bot.user.id}> help.`);
      if (message.content.startsWith(`<@!${bot.user.id}>`))
        message.content = message.content.replace(`<@!${bot.user.id}>`, prefix);
      if (message.content.startsWith(`<@${bot.user.id}>`))
        message.content = message.content.replace(`<@${bot.user.id}>`, prefix);
    }
    
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    
    var args = message.content.slice(prefix.length).split(/ +/);
    args = args.filter(e=>e)
    const command = args.length > 0?args.shift().toLowerCase():undefined;
    
    let cmdexe = bot.commands.get(command)?bot.commands.get(command).command:undefined || bot.commands.find(c=>c.aliases&&c.aliases.includes(command))?bot.commands.find(c=>c.aliases&&c.aliases.includes(command)).command: undefined;
    if (!cmdexe) return;
    if (message.author.bot&&!bot.allowedCommands.includes(cmdexe.name)) return;
    
    let botPerms = [];
    let missingPerms = [];
    cmdexe.permissions.forEach(p=>{
      botPerms.push(message.channel.permissionsFor(bot.user).has(p));
      if (!(message.channel.permissionsFor(bot.user).has(p)))
        missingPerms.push(p);
    })
    missingPerms = missingPerms.join("\n");
    if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
    cmdexe.execute(message, args, bot, Discord, prefix);

      bot.commands.get(interaction.commandName.toLowerCase()).command.slashExecute(interaction);
      const partners = [
          {
              name: "Dumbot",
              linkName: "Bot Invite",
              link: "https://discord.com/oauth2/authorize?client_id=870239976690970625&permissions=0&scope=bot"
          }
      ];
      if (Math.random() * 50 == 2) {
          const partnershipEmbed = new Discord.MessageEmbed()
              .setColor("#e52165")
              .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
              .setTitle("Our Partners")
              .setFooter("Bot by TechAllByHarshit#1503")
              .setTimestamp();
          for (let partner of partners) {
              partnershipEmbed.addField(`${partner.name}`, `[${partner.linkName}](${partner.link})`);
          }
          message.reply({ embeds: [partnershipEmbed] });
      }
  },
};
const afkConfig = require('../Schemas/afk');
const mongo = require(`../mongo`);
const Discord = require("discord.js")
module.exports = {
	name: 'messageCreate',
  async execute(message) {
    let bot = message.client;
    let prefix;
		if (message.author.bot&&!bot.allowedBots.includes(message.author.id)) return;

	  if (message.channel.type === 'dm') {
		  return;
	  }

    if (bot.afk.has(message.author.id)) {
      message.reply("Welcome back! I have cleared your AFK");
      bot.afk.delete(message.author.id);
	    await mongo().then(async (mongoose)=>{    
        await afkConfig.findOneAndRemove({
          _id: message.author.id
        })
      })
    }

    if (message.mentions.members.size>0) {
      let mentions = message.mentions.members;
      let arr = []
      mentions.forEach((item, index)=>{
        let mention = item;
        let afkStatus = bot.afk.get(mention.user.id);
        if (afkStatus)
          arr.push(`${mention.user.username} is AFK. Message: ${afkStatus.msg} - <t:${afkStatus.time}:R>`);
      })
      if (arr.length>0)
        message.channel.send(arr.join("\n"));
    }

	  prefix = bot.serverConfig.get(message.guild.id)!=undefined?bot.serverConfig.get(message.guild.id).prefix:undefined;
	  if (!prefix) {
      let result = bot.serverConfig.get(message.guild.id);
      bot.serverConfig.set(message.guild.id, {
        prefix: "%",
        suggestion: result?result.suggestion:undefined,
        welcome: result?result.welcome:undefined,
        leave: result?result.leave:undefined,
        modLog: result?result.modLog:undefined,
		    ghost: result?result.ghost:undefined,
        autoRole: result?result.autoRole:undefined,
        goal: result?result.goal:undefined,
        giveaway: result?result.giveaway:undefined
      });
      prefix = "%";
	  }
    
    prefix = prefix.toLowerCase();

    if (message.content.startsWith(`<@!${bot.user.id}>`)||message.content.startsWith(`<@${bot.user.id}>`)) {
      if (message.content.trim() == `<@!${bot.user.id}>` || message.content.trim() == `<@${bot.user.id}>`)
        return message.reply(`My prefix in this server is \`${prefix}\`. You can also ping me for running a command, eg: <@${bot.user.id}> help.`);
      if (message.content.startsWith(`<@!${bot.user.id}>`))
        message.content = message.content.replace(`<@!${bot.user.id}>`, prefix);
      if (message.content.startsWith(`<@${bot.user.id}>`))
        message.content = message.content.replace(`<@${bot.user.id}>`, prefix);
    }
    
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    
    var args = message.content.slice(prefix.length).split(/ +/);
    args = args.filter(e=>e)
    const command = args.length > 0?args.shift().toLowerCase():undefined;
    
    let cmdexe = bot.commands.get(command)?bot.commands.get(command).command:undefined || bot.commands.find(c=>c.aliases&&c.aliases.includes(command))?bot.commands.find(c=>c.aliases&&c.aliases.includes(command)).command: undefined;
    if (!cmdexe) return;
    if (message.author.bot&&!bot.allowedCommands.includes(cmdexe.name)) return;
    
    let botPerms = [];
    let missingPerms = [];
    cmdexe.permissions.forEach(p=>{
      botPerms.push(message.channel.permissionsFor(bot.user).has(p));
      if (!(message.channel.permissionsFor(bot.user).has(p)))
        missingPerms.push(p);
    })
    missingPerms = missingPerms.join("\n");
    if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
    cmdexe.execute(message, args, bot, Discord, prefix);

    bot.commands.get(interaction.commandName.toLowerCase()).command.slashExecute(interaction);
    const partners = [
          {
              name: "Dumbot",
              linkName: "Bot Invite",
              link: "https://discord.com/oauth2/authorize?client_id=870239976690970625&permissions=0&scope=bot"
          }
      ];
    if (Math.random() * 50 == 2) {
          const partnershipEmbed = new Discord.MessageEmbed()
              .setColor("#e52165")
              .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
              .setTitle("Our Partners")
              .setFooter("Bot by TechAllByHarshit#1503")
              .setTimestamp();
          for (let partner of partners) {
              partnershipEmbed.addField(`${partner.name}`, `[${partner.linkName}](${partner.link})`);
          }
          message.reply({ embeds: [partnershipEmbed] });
    }
  },
};
