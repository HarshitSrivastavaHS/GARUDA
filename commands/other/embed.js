module.exports = {
    name: 'embed',
    type: 'utility',
    usage: `&{prefix}embed <optional channel> --flags\n&{prefix}embed #test --t This is the title --d This is the description --c #FF0000`,
    description: 'Sends an embed.\nFlags are:\n--f To set the footer\n--c to set the colour (use hex)\n--t to set the title\n--d to set the description',
    aliases: ["emb"],
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
        

        if (args.length<1) return message.channel.send("Wrong syntax");
        if (args.join(" ").indexOf("--")<0) return message.channel.send("Invalid Syntax");
        let arguments = args.join(" ").split("--");
        for (let i in arguments)
            arguments[i] = arguments[i].trim();
        arguments = arguments.filter(Boolean)
        let title, colour, description, footer;
        let channel = message.mentions.channels.first();
        if (arguments.length<1) return message.channel.send("Invalid Syntax");
        if (!arguments[0].startsWith("<#")||!arguments[0].split(" ")[0].includes(channel.id)) {
            channel = undefined;
        }
        else {
            arguments.shift();
        }
        
        if (channel && (!message.member.permissionsIn(channel).toArray().includes("SEND_MESSAGES")||!message.member.permissionsIn(channel).toArray().includes("EMBED_LINKS"))) return message.channel.send("You do not have permission to send message/embed links in that channel.")
            
        if (channel && (!channel.permissionsFor(bot.user).toArray().includes("SEND_MESSAGES")||!channel.permissionsFor(bot.user).toArray().includes("EMBED_LINKS"))) return message.channel.send("I do not have permission to send message/embed links in that channel.")    
            
        let err = false;
        const embed = new Discord.MessageEmbed()
    
        let errdes = "";
        arguments.map(a=>{
            let b = a.split(/ +/);
            let c = b.slice(1).join(" ");
            switch(b[0].toLowerCase()) {
                case "c": colour = c;
                    if (!/^#([A-Fa-f0-9]{6})$/.test(colour)) {
                        err= true;
                        errdes += `Not a valid hex value: \`${colour.length>0?colour:"Not provided"}\`\n`
                    }
                        embed.setColor(colour);
                    break
                case "t": title = c;
                    if (title.length<1){
                        err = true;
                        errdes += `Specify the title after \`--${b[0]}\`\n`; 
                    }
                    embed.setTitle(title);
                    break;
                case "d": description = c;
                    if (description.length<1) {
                        err = true;
                        errdes += `Specify the description after \`--${b[0]}\`\n`; 
                    }
                    embed.setDescription(description);
                    break;
                case "f": footer = c;
                    if (footer.length<1) {
                        err = true;
                        errdes += `Specify the footer after \`--${b[0]}\`\n`; 
                    }
                    embed.setFooter(footer);
                    break;
                default: err = true; 
                        errdes += `Not a valid flag: \`--${b[0]}\`\n`; 
            }
        })
        if (err) return message.channel.send(errdes);
        if (!footer&&!description&&!title) return message.channel.send("At least one of the values are to be specified: title, description or footer");
        if (channel&&channel.id!=message.channel.id) {
            channel.send({embeds:[embed]})
            message.channel.send(`Embed posted in ${channel}`);
        }
        else {
            message.channel.send({embeds: [embed]});
            message.delete();
        }
    }
}
