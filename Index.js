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

const iamonline = function iamonline() {
    bot.users.cache.get("451693463742840842").send("I am Online!");
}

bot.on("ready", ()=>{
    bot.user.setActivity(`${bot.guilds.cache.size} servers`, {type: "WATCHING"});
    iamonline();
})

bot.on("message", message => {
    
    if (message.mentions.members.has("777840690515279872"))
    
    if (message.author.bot) return;
    
    if (message.channel.type === ("dm")) {
        message.channel.send(`Hello ${message.author}!\nI do not accept commands in DM\nTo know my prefix in a server, just ping me and i will tell the prefix.`); 
        return;
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

    else if (command === 'clear') {
        bot.commands.get('clear').execute(message, args);
    }

})

bot.login(process.env.TOKEN);
