console.log(process.version)
const Discord = require('discord.js');
const Statcord = require("statcord.js");
const keepAlive = require('./server.js');
require('dotenv').config()

const bot = new Discord.Client({ intents: new Discord.Intents([
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING"
]), allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });

const statcord = new Statcord.Client({
  client: bot,
  key: process.env.statcord
}); 

const mongo = require(`./mongo`);
const welcomeJS = require(`./util/welcome`);
const afkConfig = require('./Schemas/afk');
require("./util/dbload")(bot);

let prefix;

const fs = require('fs');
const { Collection } = require('mongoose');

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, categories)=>{
  if (err) return console.err(err)
 console.log(`Found total ${categories.length} categories`) 
 categories.forEach((category) =>{
      let cmd = fs.readdirSync(`./commands/${category}/`).filter(f=>f.endsWith(".js"))
      for (let command of cmd) {
          command = require(`./commands/${category}/${command}`)
          bot.commands.set(command.name, {category, command, aliases: command.aliases})
      }
      console.log(`Loaded total ${cmd.length} commands in ${category}`);
 })
});



bot.on("guildMemberUpdate", async (oldMember, newMember)=>{
   if (bot.freezer.has(`${newMember.guild.id}-${newMember.user.id}`)) {
     if (newMember.nickname != bot.freezer.get(`${newMember.guild.id}-${newMember.user.id}`))
     newMember.setNickname(bot.freezer.get(`${newMember.guild.id}-${newMember.user.id}`)).catch((err)=>{
         return console.log(err);
     });
  }
})

bot.on("guildMemberAdd", async (member) => {
  if (bot.freezer.has(`${member.guild.id}-${member.user.id}`)) {
     member.setNickname(bot.freezer.get(`${member.guild.id}-${member.user.id}`)).catch((err)=>{
         console.log(err);
     });
  }
  let wc = bot.serverConfig.get(member.guild.id)!=undefined?bot.serverConfig.get(member.guild.id).welcome:undefined;
  if (wc) {
	const welcomeCH = await bot.channels.fetch(wc);
	if (member.user.bot) {
		welcomeCH.send(`${member} was just invited to the server.`);
	}
  	else {
  		welcomeJS.execute(member, welcomeCH, Discord);
	}
  }
  let ar = bot.serverConfig.get(member.guild.id)!=undefined?bot.serverConfig.get(member.guild.id).autoRole:undefined;
  if (ar){
  	let autorole = member.guild.roles.cache.get(ar);
	if (autorole) {
		if (!member.user.bot){
			member.roles.add(autorole);
		}
	}
  }
})

bot.on("guildMemberRemove", async (member) => {
  let gc = bot.serverConfig.get(member.guild.id)!=undefined?bot.serverConfig.get(member.guild.id).leave:undefined;
  if (!gc) return;
  const byeCH = await bot.channels.fetch(gc);
  byeCH.send(`${member.user.username}#${member.user.discriminator} just left the server.`);
})

/*
bot.on("guildCreate", function(guild){
    bot.user.setPresence({
        activity: { name: `${bot.guilds.cache.size} servers and ${bot.users.cache.size} users`, type: 'WATCHING' },
        status: 'ONLINE'
    });
});

bot.on("guildDelete", function(guild){
    bot.user.setPresence({
        activity: { name: `${bot.guilds.cache.size} servers and ${bot.users.cache.size} users`, type: 'WATCHING' },
        status: 'ONLINE'
    });
});
*/
bot.on('ready', async () => {
  statcord.autopost();
	console.log('I am Online!');
	bot.user.setPresence({
    activities: [{ name: `Ping me for help!`, type: 'WATCHING' }],
  });
	require("./functions/ghostping")(bot, Discord);
  require("./functions/modLog")(bot, Discord);
	
});

bot.snipes = new Map();
bot.editSnipes = new Map();

bot.on('messageDelete', async (message, channel) => {
	if (message.author.bot) return;
	bot.snipes.set(message.channel.id, {
		content: message.content,
		author: message.author.tag,
		avatar: message.author.displayAvatarURL(),
		image: message.attachments.first()
			? message.attachments.first().proxyURL
			: null,
                time: Date.now()
	});
	
    
});

bot.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
  if (oldMessage.content == newMessage.content) return;
	bot.editSnipes.set(oldMessage.channel.id, {
		oldContent: oldMessage.content,
		newContent: newMessage.content,
		author: oldMessage.author.tag,
		avatar: oldMessage.author.displayAvatarURL(),
		time: newMessage.editedTimestamp
	});
    
});

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}





bot.fasttype = new Array();
bot.allowedBots = new Array();
bot.allowedCommands = new Array();
bot.on('message', async message => {

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
                goal: result?result.goal:undefined
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
  statcord.postCommand(cmdexe.name, message.author.id);
  let botPerms = [];
  let missingPerms = [];
  cmdexe.permissions.forEach(p=>{
  botPerms.push(message.channel.permissionsFor(bot.user).has(p));
  if (!(message.channel.permissionsFor(bot.user).has(p)))
    missingPerms.push(p);
  })
  missingPerms = missingPerms.join("\n");
  if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
  //statcord.post();
  cmdexe.execute(message, args, bot, Discord, prefix);
});

statcord.on("autopost-start", () => {
  // Emitted when statcord autopost starts
  console.log("Started autopost");
}); 

statcord.on("post", status => {
  // status = false if the post was successful
  // status = "Error message" or status = Error if there was an error
  if (status) console.error(status);
}); 

keepAlive();
console.log("logged in");
bot.login(process.env.TOKEN); 
