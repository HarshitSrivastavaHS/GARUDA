const Discord = require('discord.js');
const keepAlive = require('./server.js');

const bot = new Discord.Client({ ws: { intents: new Discord.Intents([
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS",
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
]) }}};

const mongo = require(`./mongo`);
const serverConfig = require('./Schemas/server-config');
const giveawaySchema = require('./Schemas/giveaway-schema.js');
const welcomeJS = require(`./util/welcome`);
const Canvas = require("canvas");
const afkConfig = require('./Schemas/afk');
const give = require('./functions/giveaway.js');

let prefix;

const fs = require('fs');
const { Collection } = require('mongoose');

bot.commands = new Discord.Collection();

const commandFiles = fs
	.readdirSync('./commands/')
	.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	bot.commands.set(command.name, command);
}

bot.serverConfig = new Map();

const server = async ()=>{
	const results = await serverConfig.find();
        for (const result of results){
            bot.serverConfig.set(result._id, {
                prefix: result.prefix,
                suggestion: result.suggestion,
                welcome: result.welcome,
                leave: result.leave,
                modLog: result.modLog,
		ghost: result.ghost,
		autoRole: result.autoRole
            });
        }
}

bot.on("guildMemberAdd", async (member) => {
  let wc = bot.serverConfig.get(member.guild.id)!=undefined?bot.serverConfig.get(member.guild.id).welcome:undefined;
  if (wc) {
	const welcomeCH = member.guild.channels.cache.get(wc) || member.guild.fetch(wc);
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
  const byeCH = member.guild.channels.cache.get(gc) || member.guild.fetch(gc);
  byeCH.send(`${member.user.username}#${member.user.discriminator} just left the server.`);
})

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

bot.on('ready', async () => {
        server();
	console.log('I am Online!');
	bot.user.setPresence({
        activity: { name: `${bot.guilds.cache.size} servers and ${bot.users.cache.size} users`, type: 'WATCHING' },
        status: 'ONLINE'
    });
	require("./functions/ghostping")(bot, Discord);
  	require("./functions/modLog")(bot, Discord);
	let allDocuments;
	
	const mongo = await require(`./mongo`);
	const giveawaySchema = require('./Schemas/giveaway-schema.js');
	await mongo().then(async mongoose => {
			allDocuments = await giveawaySchema.find({});

	});
	if (allDocuments.length < 1) return;

	for (let x in allDocuments) {
		give(
			bot,
			Discord,
			allDocuments[x]._id,
			allDocuments[x].endTime,
			allDocuments[x].winners,
			allDocuments[x].prize,
			allDocuments[x].chID,
			allDocuments[x].host,
     allDocuments[x].reqs,
     false
		);
	}
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
			: null
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
		image: oldMessage.attachments.first()
			? oldMessage.attachments.first().proxyURL
			: null
	});
    
});

const devIds =  {
    "451693463742840842":true,
    "699972833094271046" :true
};

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

bot.afk = new Map();
const afkusers = async ()=>{
	const results = await afkConfig.find();
        for (const result of results){
            bot.afk.set(result._id, result.afk);
        }
}
afkusers();

bot.fasttype = new Array();

bot.on('message', async message => {

	if (message.author.bot) return;

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
                    arr.push(`${mention.user.username} is AFK. Message: ${afkStatus}`);
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
                autoRole: result?result.autoRole:undefined
        });
        prefix = "%";
	}
        prefix = prefix.toLowerCase();

    if (message.content.startsWith(`<@!${bot.user.id}>`)||message.content.startsWith(`<@${bot.user.id}>`))
        message.reply("My prefix in this server is `"+prefix+"`");
	if (!message.content.toLowerCase().startsWith(prefix)) return;
    
    var args = args = message.content.slice(prefix.length).split(/ +/);
     
    const command = args.shift().toLowerCase();
    if (message.content.startsWith(prefix + "eval")) {
    
    if(!devIds[message.author.id]) return;
    const text = /process.env/i;
    const isMatch = args.some(arg => arg.match(text));
    if (isMatch) return message.channel.send("Code with process.env won't work :)")
    try {
      	const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, { depth: 0 });


      return message.channel.send(clean(evaled), { code:"xl", split: true });
    } catch (err) {
      return message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    } 
    
  }
  let cmdexe = bot.commands.get(command) || bot.commands.find(c=>c.aliases&&c.aliases.includes(command));
  if (!cmdexe) return;
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
});

keepAlive();
console.log("logged in");
bot.login(process.env.TOKEN); 
