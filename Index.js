const Discord = require("discord.js");

const bot = new Discord.Client();

const prefix = '%';

const fs = require('fs');

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);

}

/*const iamonline = function iamonline() {
    bot.users.cache.get("451693463742840842").send("I am Online!");
}*/

bot.on("ready", ()=>{
    console.log("I am Online!");
    bot.user.setActivity(`${bot.guilds.cache.size} servers`, {type: "WATCHING"});
    //iamonline();
})

bot.snipes = new Map();
bot.on("messageDelete", (message, channel)=>{
   bot.snipes.set(message.channel.id, {
      content: message.content,
      author: message.author.tag,
      avatar: message.author.displayAvatarURL,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null
   });
})

bot.on("message", message => {
    
    if (message.author.bot) return;
    
    if (message.channel.type === ("dm")) {
        message.channel.send(`Hello ${message.author}!\nI do not accept commands in DM\nTo know my prefix in a server, just ping me and i will tell the prefix.`); 
        return;
    }
    
    if (message.mentions.members.has("777840690515279872")) {
        message.reply(`My prefix is \`${prefix}\``);
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        bot.commands.get('ping').execute(message, args);
    }

    else if (command === 'details') {
        bot.commands.get('details').execute(message, args, Discord, bot);
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
    
    else if (command === 'maths') {
        bot.commands.get('maths').execute(message, args, bot, Discord);
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

})

bot.login(process.env.TOKEN);
