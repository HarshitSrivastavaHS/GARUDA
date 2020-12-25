const Discord = require("discord.js");
const keepAlive = require("./server.js");

const bot = new Discord.Client();
const mongo = require(`./mongo`);
const welcomeSchema = require(`./Schemas/welcome-schema`);

const prefix = '%';

const fs = require('fs');

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

  const command = require(`./commands/${file}`);

  bot.commands.set(command.name, command);

}

bot.on("ready", () => {
  console.log("I am Online!");
  bot.user.setPresence({ activity: { name: `${bot.guilds.cache.size} servers`, type: "WATCHING" }, status: 'dnd' });
})

bot.welcomeChannel = new Map();

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

bot.on('guildMemberAdd', async (member) => {
    let data = bot.welcomeChannel.get(member.guild.id);
        if (!data) {
          await mongo().then(async (mongoose)=>{
            try {
              const result = await welcomeSchema.findOne({
                _id: member.guild.id
              })
              data = result!=null?[result.channelId, result.text]:null;
            }
            finally {
              mongoose.connection.close()
            }
          })
        }
        if (data!=null) {
          const channelID = data[0]?data[0]:data.welChannel;
          const text = data[1]?data[1]:data.welMessage;
          const channel = member.guild.channels.cache.get(channelID);
          channel.send(text);
          bot.welcomeChannel.set(member.guild.id, {
          welChannel: channelID,
          welMessage: text
        })
        }  
})

bot.on("message", message => {

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
    bot.commands.get('ping').execute(message, args);
  }

  else if (command === 'info') {
    bot.commands.get('info').execute(message, args, Discord, bot);
  }

  else if (command === 'repeat') {
    bot.commands.get('repeat').execute(message, args, prefix);
  }

  else if (command === 'kick') {
    bot.commands.get('kick').execute(message, args);
  }

  else if (command === 'ban') {
    bot.commands.get('ban').execute(message, args);
  }

  else if (command === 'clear') {
    bot.commands.get('clear').execute(message, args);
  }

  else if (command === 'help') {
    bot.commands.get('help').execute(message, args, bot, Discord);
  }

  else if (command === 'country') {
    bot.commands.get('country').execute(message, args, bot, Discord);
  }

  else if (command === 'covid') {
    bot.commands.get('covid').execute(message, args, bot, Discord);
  }

  else if (command === 'avatar') {
    bot.commands.get('avatar').execute(message, args, bot, Discord);
  }

  else if (command === 'google') {
    bot.commands.get('google').execute(message, args, bot, Discord);
  }

  else if (command === 'flip') {
    bot.commands.get('flip').execute(message, args, bot, Discord);
  }

  else if (command === 'snipe') {
    bot.commands.get('snipe').execute(message, args, bot, Discord);
  }

  else if (command === 'editsnipe') {
    bot.commands.get('editsnipe').execute(message, args, bot, Discord);
  }

  else if (command === 'giveaway') {
    bot.commands.get('giveaway').execute(message, args, bot, Discord);
  }

  else if (command === 'poll') {
    bot.commands.get('poll').execute(message, args, bot, Discord);
  }

  else if (command === 'fuse') {
    bot.commands.get('fuse').execute(message, args, bot, Discord);
  }

  else if (command === '8ball') {
    bot.commands.get('8ball').execute(message, args, bot, Discord);
  }

  else if (command === 'play') {
    bot.commands.get('play').execute(message, args, bot, Discord);
  }

  else if (command === 'leave') {
    bot.commands.get('leave').execute(message, args, bot, Discord);
  }

  else if (command === 'add') {
    bot.commands.get('add').execute(message, args, bot, Discord);
  }

  else if (command === 'sub') {
    bot.commands.get('sub').execute(message, args, bot, Discord);
  }

  else if (command === 'multi') {
    bot.commands.get('multi').execute(message, args, bot, Discord);
  }

  else if (command === 'announce') {
    bot.commands.get('announce').execute(message, args, bot, Discord);
  }

  else if (command === 'setwelcome') {
    bot.commands.get('setwelcome').execute(message, args, bot, Discord);
  }

  else if (command === 'jointest') {
    bot.commands.get('jointest').execute(message, args, bot, Discord);
  }

})

keepAlive();
bot.login(process.env.TOKEN);
