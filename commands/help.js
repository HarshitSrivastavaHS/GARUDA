
module.exports = {
    name: 'help',
    description: 'shows the help menu',
    execute(message, args, bot, Discord) {
        const fs = require('fs');
        const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
        const helpembed = new Discord.MessageEmbed()
        .setColor("#D441EE");
        if (commandFiles.includes(args[0]+".js")) {
           const command = require(`${__dirname}/${args[0]}.js`).description; 
           helpembed.addFields({name:`${args[0]}` value: ${command}`});
        }
        else {
            for (const file of commandFiles) {  
                const command = require(`${__dirname}/${file}`).description;  
                helpembed.addFields({name:`${file.slice(0, file.indexOf("."))}`,value: `${command}`});
            }
        }
        message.channel.send(helpembed);
    }
}
