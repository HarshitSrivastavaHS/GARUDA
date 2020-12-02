
module.exports = {
    name: 'help',
    description: 'shows the help menu',
    execute(message, args, bot, Discord) {
        const fs = require('fs');
        message.channel.send("Coming Soon.");
        const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
        const helpembed = new Discord.MessageEmbed()
        .setColor("#D441EE");
        for (const file of commandFiles) {  
            const command = require(`${__dirname}/${file}`).description;  
            helpembed.addFields({name:`${file}`,value: `${command}`});
        }
    }
}
