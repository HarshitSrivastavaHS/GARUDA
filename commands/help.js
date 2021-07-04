
module.exports = {
    name: 'help',
    description: 'shows the help menu',
    aliases: [],
    usage: "&{prefix}help",
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
        const PREFIX_REG = /&{prefix}/g;
         const fs = require('fs');
         const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
        let cmd = bot.commands.get(args[0]?args[0].toLowerCase():"") || bot.commands.find(c=>c.aliases&&c.aliases.includes(args[0]?args[0].toLowerCase():""));
        const helpembed = new Discord.MessageEmbed()    
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        .setColor("#D441EE")
        .setTitle('Help Menu')
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp();
        if (cmd) {
           const command = cmd; 
           helpembed.addFields({name:`Name`, value: `${command.name}`},{name:`Description`, value: `${command.description}`},{name:`Usage`, value: `${command.usage?command.usage.replace(PREFIX_REG, prefix):"not added"}`}, {name:`Aliases`, value: `${command.aliases.length>0?command.aliases.join(", "):"No Alias"}`}, {name:`Permissions Required by bot`, value: `${command.permissions?command.permissions.join(", ").toLowerCase().replace(/_/g," "):"not added"}`});
        }
        else {
            helpembed.setDescription(`Do \`${prefix}help <command>\` for more info on that command.\nJoin the support server: https://discord.gg/sBe3jNSdqN`);
            let categories = ["moderation", "game", "fun", "maths", "info", "utility", "admin"]
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
                helpembed.addFields({name:`${categories[cat][0].toUpperCase()+categories[cat].substr(1, categories[cat].length)}`, value: str?str:"No command"});
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
        }
        
        message.channel.send(helpembed);
    }
}
 
