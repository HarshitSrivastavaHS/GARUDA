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

bot.on("guildMemberAdd", member => {
    const welchannel = guild.channels.cache.find(ch => ch.name==="general");
    const welEmbed = new Discord.MessageEmbed()
    .setColor("red")
    .setTitle(`Welcome ${member} to ${guild.name}!`)
    .setDescription("We hope that you will have fun here!") 
    .setImage(member.displayAvatarURL())
    welchannel.send(welEmbed);
})

bot.on("message", message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

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
        bot.commands.get('kick').execute(message, args, bot);
    }

    else if (command === 'clear') {
        bot.commands.get('clear').execute(message, args);
    }

})

console.log("A-Bot started!");

bot.login(process.env.TOKEN);
