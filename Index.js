const Discord = require("discord.js");
const keepAlive = require("./server.js");

const bot = new Discord.Client();
const mongo = require(`./mongo`);
const prefixSchema = require(`./Schemas/prefix-schema`);
const giveawaySchema = require("./Schemas/giveaway-schema.js")

let prefix;

const fs = require('fs');

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

  const command = require(`./commands/${file}`);

  bot.commands.set(command.name, command);

}

bot.on("ready", async () => {
  console.log("I am Online!");
  bot.user.setPresence({ activity: { name: `${bot.guilds.cache.size} servers`, type: "WATCHING" }, status: 'dnd' });
  let allDocuments;
  const give = require("./functions/giveaway.js")
  const mongo = await require(`./mongo`);
  const giveawaySchema = require("./Schemas/giveaway-schema.js")
  await mongo().then(async (mongoose)=>{
    try {
      allDocuments = await giveawaySchema.find({})
    }
    finally {
      mongoose.connection.close();
    }
  })
  if (allDocuments.length<1) return 

  for (let x in allDocuments) {
    give(bot, Discord, allDocuments[x]._id, allDocuments[x].endTime, allDocuments[x].prize, allDocuments[x].chID);
  }
})

bot.snipes = new Map();

bot.on("messageDelete", (message, channel) => {
  if (message.author.bot) return;
  bot.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author.tag,
    avatar: message.author.displayAvatarURL(),
    image: message.attachments.first() ? message.attachments.first().proxyURL : null
  });
})

bot.editSnipes = new Map();
bot.on("messageUpdate", (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  bot.editSnipes.set(oldMessage.channel.id, {
    oldContent: oldMessage.content,
    newContent: newMessage.content,
    author: oldMessage.author.tag,
    avatar: oldMessage.author.displayAvatarURL(),
    image: oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null
  });
})

bot.prefixes = new Map();
bot.suggestionChannel = new Map();
bot.on("message", async (message) => {

  prefix = bot.prefixes.get(message.guild.id);
  if (!prefix) {
    await mongo().then(async (mongoose)=>{
      try {
        const result = prefixSchema.findOne({
          _id: message.guild.id
        })
        prefix = result!=null?result.prefix:null;
        if (prefix){
          bot.prefixes.set(message.guild.id, prefix);
        }
        else {
          prefix = "%";
          bot.prefixes.set(message.guild.id, "%");
        }
      }
      finally {
        mongoose.connection.close()
      }
    })
  }

  if (message.author.bot) return;

  if (message.channel.type === ("dm")) {
    message.channel.send(`Hello ${message.author}!\nI do not accept commands in DM\nTo know my prefix in a server, just ping me and i will tell the prefix.`);
    return;
  }

  if (message.mentions.members.has("777840690515279872")) {
    message.channel.send(`My prefix is \`${prefix}\``);
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    bot.commands.get('ping').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'info') {
    bot.commands.get('info').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'repeat') {
    bot.commands.get('repeat').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'kick') {
    bot.commands.get('kick').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'ban') {
    bot.commands.get('ban').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'clear') {
    bot.commands.get('clear').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'help') {
    bot.commands.get('help').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'country') {
    bot.commands.get('country').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'covid') {
    bot.commands.get('covid').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'avatar') {
    bot.commands.get('avatar').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'flip') {
    bot.commands.get('flip').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'snipe') {
    bot.commands.get('snipe').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'editsnipe') {
    bot.commands.get('editsnipe').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'giveaway') {
    bot.commands.get('giveaway').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'poll') {
    bot.commands.get('poll').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'fuse') {
    bot.commands.get('fuse').execute(message, args, bot, Discord, prefix);
  }

  else if (command === '8ball') {
    bot.commands.get('8ball').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'add') {
    bot.commands.get('add').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'sub') {
    bot.commands.get('sub').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'multi') {
    bot.commands.get('multi').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'prefix') {
    bot.commands.get('prefix').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'setsuggestion') {
    bot.commands.get('setsuggestion').execute(message, args, bot, Discord, prefix);
  }

  else if (command === 'suggest') {
    bot.commands.get('suggest').execute(message, args, bot, Discord, prefix);
  }
  
  else if (command === 'cat') {
    bot.commands.get('cat').execute(message, args, bot, Discord, prefix);
  }
 
  else if (command === 'dm') {
    bot.commands.get('dm').execute(message, args, bot, Discord, prefix);
  }

})

keepAlive();
bot.login(process.env.TOKEN);
