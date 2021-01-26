const Discord = require('discord.js');
const keepAlive = require('./server.js');

const bot = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) }});

const mongo = require(`./mongo`);
const prefixSchema = require(`./Schemas/prefix-schema`);
const welcomeSchema = require(`./Schemas/welcome-Schema`);
const giveawaySchema = require('./Schemas/giveaway-schema.js');
const suggestionSchema = require(`./Schemas/suggestion-schema`);
const welcomeJS = require(`./util/welcome`);
const leaveSchema = require(`./Schemas/leave-schema`);
const Canvas = require("canvas");

let prefix;

const fs = require('fs');

bot.commands = new Discord.Collection();

const commandFiles = fs
	.readdirSync('./commands/')
	.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	bot.commands.set(command.name, command);
}

bot.welcome = new Map();
const loadWelcome = async ()=>{
	const results = await welcomeSchema.find();
  for (const result of results){
    bot.welcome.set(result._id, {
            chID: result.chID
          });
  }
}
loadWelcome()

bot.on("guildMemberAdd", async (member) => {
  let wc = bot.welcome.get(member.guild.id);
  if (!wc) return;
  const welcomeCH = member.guild.channels.cache.get(wc.chID) || member.guild.fetch(wc.chID);
  welcomeJS.execute(member, welcomeCH, Discord);
})

bot.leaves = new Map();
const loadBye = async ()=>{
	const results = await leaveSchema.find();
  for (const result of results){
    bot.leaves.set(result._id, result.chID);
  }
}
loadBye()

bot.on("guildMemberRemove", async (member) => {
  let gc = bot.leaves.get(member.guild.id);
  if (!gc) return;
  const byeCH = member.guild.channels.cache.get(gc) || member.guild.fetch(gc);
  byeCH.send(`${member.user.username}#${member.user.discriminator} just left the server.`);
})

bot.on('ready', async () => {
	console.log('I am Online!');
	bot.user.setPresence({
		activity: { name: `${bot.guilds.cache.size} servers`, type: 'WATCHING' },
		status: 'dnd'
	});
	let allDocuments;
	const give = require('./functions/giveaway.js');
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
			allDocuments[x].prize,
			allDocuments[x].chID
		);
	}
});

bot.snipes = new Map();

bot.on('messageDelete', (message, channel) => {
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

bot.editSnipes = new Map();
bot.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
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

bot.prefixes = new Map();
const loadPrefix = async ()=>{
	const results = await prefixSchema.find();
  for (const result of results){
    bot.prefixes.set(result._id, result.prefix);
  }
}
loadPrefix()
bot.suggestionChannel = new Map();
const loadSuggestion = async ()=>{
	const results = await suggestionSchema.find();
  for (const result of results){
    bot.suggestionChannel.set(result._id, result.channel_Id);
  }
}
loadSuggestion()

bot.on('message', async message => {

	if (message.author.bot) return;

	if (message.channel.type === 'dm') {
		return;
	}

	prefix = bot.prefixes.get(message.guild.id);
	if (!prefix) {
    bot.prefixes.set(message.guild.id, "%");
    prefix = "%";
	}

	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

  if (!bot.commands.has(command)) return;
  bot.commands.get(command).execute(message, args, bot, Discord, prefix);
});

keepAlive();
console.log("logged in")
bot.login(process.env.TOKEN);