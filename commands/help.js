
module.exports = {
    name: 'help',
    desccription: 'shows the help menu',
    execute(message, args, bot) {
        message.channel.send("Coming Soon.");
        const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {  
            const command = require(`./commands/${file}`);  
            bot.commands.set(command.name, command);
        }
        for (const command in command.name){
            message.channel.send(command);
        }
    }
}
