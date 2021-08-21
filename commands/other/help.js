
module.exports = {
    name: 'help',
    description: 'shows the help menu',
    aliases: [],
    usage: "&{prefix}help",
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        if (message.author.id!="451693463742840842")
            return message.channel.send("Command is disabled due to some bugs")
        const PREFIX_REG = /&{prefix}/g;
        const fs = require('fs');
        const categories = fs.readdirSync(`./commands/`);
        let cmd = bot.commands.get(args[0]?args[0].toLowerCase():"") || bot.commands.find(c=>c.aliases&&c.aliases.includes(args[0]?args[0].toLowerCase():""));
        let ctg = categories.find(c=>c==args[0]?.toLowerCase())
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
        else if (ctg) {
            let cat = require(`./commands/${ctg}`);
            helpembed.addFields({
                name: `Name`,
                value: `${cat.join(", ")}`
            })
        }
        else {
            helpembed.setDescription(`Do \`${prefix}help <command>\` for more info on that command.\nJoin the support server: https://discord.gg/sBe3jNSdqN`);
            for (let category of categories) {
                let str = "";
                category = require(`./commands/${category}`)
                for (const file of category) {
                    const command = require(`./commands/${category}/${file}`);
                    str += `\`${command.name}\``;
                }
                helpembed.addFields({name:`${category[0].toUpperCase()+category.substr(1, category.length)}`, value: str?str:"No command"});
            }
        }
        
        message.channel.send({embeds:[helpembed]});
    }
}
 
