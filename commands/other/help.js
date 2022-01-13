
module.exports = {
    name: 'help',
    description: 'shows the help menu',
    aliases: [],
    usage: "&{prefix}help",
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        const PREFIX_REG = /&{prefix}/g;
        const fs = require('fs');
        const categories = fs.readdirSync(`./commands/`);
        let emojis = {
            "developer-only": ":computer:",
            "fun": ":confetti_ball:",
            "game": ":video_game:",
            "giveaway": ":tada:",
            "image": ":page_facing_up:",
            "info": ":information_source:",
            "moderation": ":robot:",
            "other": ":dolls:",
            "server-config": ":tools:"
        }
        let cmd = bot.commands.get(args[0]?args[0].toLowerCase():"")?.command || bot.commands.find(c=>c.aliases&&c.aliases.includes(args[0]?args[0].toLowerCase():""))?.command;
        let ctg = categories.find(c=>c==args[0]?.toLowerCase())
        const helpembed = new Discord.MessageEmbed()    
        .setThumbnail(message.author.displayAvatarURL({dynamic: true, size: 4096}))
        .setColor("YELLOW")
        .setTitle('Help Menu')
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp();
        let btn;
        if (cmd) {
           const command = cmd; 
           helpembed.addFields({name:`Name`, value: `${command.name}`},{name:`Description`, value: `${command.description}`},{name:`Usage`, value: `${command.usage?command.usage.replace(PREFIX_REG, prefix):"not added"}`}, {name:`Aliases`, value: `${command.aliases.length>0?command.aliases.join(", "):"No Alias"}`}, {name:`Permissions Required by bot`, value: `${command.permissions?command.permissions.join(", ").toLowerCase().replace(/_/g," "):"not added"}`});
        }
        else if (ctg) {
            let cat = fs.readdirSync(`./commands/${ctg}/`).filter(f=>f.endsWith(".js"));
            let str = ""
            for (let file of cat){
                file = require(`../../commands/${ctg}/${file}`)
                str += `\`${file.name}\` `;
            }
            str = str.split(" ").filter(c=>c!="").join(" ")
            helpembed.addFields({
                name: `${emojis[ctg]} | ${ctg[0]+ctg.substr(1, ctg.length)} Commands`,
                value: `${str?str:"No commands"}`
            })
        }
        else if (args[0]) {
            helpembed.setDescription(`**:x: No command/Category found named \`${args[0]}\`.**`);
        }
        else {
            helpembed.setDescription(`**Do \`${prefix}help <command>\` for more info on that command.**`);
            for (let category of categories) {
                let str = "";
                let commands = fs.readdirSync(`./commands/${category}/`).filter(f=>f.endsWith(".js"));
                for (const file of commands) {
                    const command = require(`../../commands/${category}/${file}`);
                    str += `\`${command.name}\` `;
                }
                str = str.split(" ").filter(s=>s!="").join(" ")
                helpembed.addFields({name:`${emojis[category]} | ${category[0].toUpperCase()+category.substr(1, category.length)}`, value: str?str:"No command"});
            }
            btn = [new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                .setLabel("Invite")
                .setURL("https://discord.com/api/oauth2/authorize?client_id=777840690515279872&permissions=8&scope=applications.commands%20bot")
                .setStyle("LINK"), 
                new Discord.MessageButton()
                .setLabel("Support Server")
                .setURL("https://discord.gg/sBe3jNSdqN")
                .setStyle("LINK"),
                new Discord.MessageButton()
                .setLabel("Vote")
                .setURL("https://top.gg/bot/777840690515279872/vote")
                .setStyle("LINK")
                )];
        }
        message.channel.send({embeds:[helpembed], components: btn});
    }
}
 
