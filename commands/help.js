
module.exports = {
    name: 'help',
    description: 'shows the help menu',
    execute(message, args, bot, Discord) {
        const fs = require('fs');
        const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
        const helpembed = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setTitle('Help Menu')
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp();
        if (commandFiles.includes(args[0]+".js")) {
           const command = require(`${__dirname}/${args[0]}.js`).description; 
           helpembed.addFields({name:`${args[0]}`, value: `${command}`});
        }
        else {
            let categories = ["moderation","fun","info", "utility"]
            let totalFiles = commandFiles.length;
            for (let cat in categories) {
                let str = "";
                for (const file of commandFiles) {
                    const command = require(`${__dirname}/${file}`);
                    if (command.type == categories[cat]) {
                        if (str == "")
                            str += `\`${command.name}\``;
                        else
                            str += `, \`${command.name}\``;
                    }
                }
                helpembed.addFields({name:`${categories[cat][0].toUpperCase+categories[cat].substr(1, categories[cat].length)}`, value: str?str:"No command"});
            }
        }
        let notype = "";
        for (const file of commandFiles){
            const command = require(`${__dirname}/${file}`);
            if (command.type == undefined) {
                if (notype == "")
                    notype += `\`${command.name}\``;
                else
                    notype += `, \`${command.name}\``;
            }
        }
        helpembed.addFields({name:`Other`, value: notype?notype:"No command"});
        message.channel.send(helpembed);
    }
}
 
