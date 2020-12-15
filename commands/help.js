
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
           helpembed.addFields({name:`${args[0]}`, value: `${command}`});
        }
        else {
            let categories = ["moderation","fun","info"]
            let totalFiles = commandFiles.length;
            for (let cat in categories) {
                let str = "";
                for (const file of commandFiles) {
                    const command = require(`${__dirname}/${file}`);
                    if (command.type == categories[cat])
                        str += `\n\`${file}\` => ${command.description}`;
                }
                helpembed.addFields({name:`${categories[cat]}`, value: str});
            }
        }
        message.channel.send(helpembed);
    }
}
 
