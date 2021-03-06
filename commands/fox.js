module.exports = {
    name: 'fox',
    type: 'fun',
    usage: '&{prefix}fox',
    description: 'get a random fox pic',
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
        message.channel.startTyping();
        const fetch = require("node-fetch");
        try {
            fetch(`https://some-random-api.ml/img/fox`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                const embed = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                	.setTimestamp()
                    .setFooter("A cute fox")
                    .setImage(`${data.link}`);                    
                message.channel.send(embed);
            })
        }
         catch(err){
                message.channel.send("💔 Something went wrong");
        }
        finally {
            message.channel.stopTyping();
        }
    }
}
 
