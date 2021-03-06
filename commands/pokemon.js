module.exports = {
    name: 'pokemon',
    type: 'info',
    usage: '&{prefix}pokemon <name>',
    description: 'get details of a pokemon.',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
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
        const poke = args[0];
        if (poke===undefined) {
            message.channel.send(`${prefix}pokemon <name>`); 
            return;
        }
        message.channel.startTyping();
        const fetch = require("node-fetch");
        try {
            fetch(`https://some-random-api.ml/pokedex?pokemon=${poke}`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                if (data.name===undefined){
                    message.reply("Could not find that pokemon. 💔");
                    message.channel.stopTyping();
                    return;
                }
                let stats = "";
                for (let [key, value] of Object.entries(data.stats)) {
                  stats += `${key}: ${value}\n`;
                }
                const pokemon = new Discord.MessageEmbed()
                    .setColor("#D441EE")
                    .setTitle(data.name.toUpperCase())
                    .setAuthor(`GARUDA Pokedex`, bot.user.displayAvatarURL())
                    .addFields(
                        { name: "Name", value: data.name},
                        { name: "Type" , value: data.type.map(el=>el).join(", ")},
                        { name: "Abilities", value: data.abilities.map(el=>el).join(", ")},
                        { name: "Height", value: `${data.height}`},
                        { name: "Weight", value: data.weight},
                        { name: "Evolution", value: data.family.evolutionLine.length>0?data.family.evolutionLine.map(el=>el).join("→"):"no evolution"},
                        { name: "Stats", value: stats}
                    )
                	.setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`)
                    .setThumbnail(`http://i.some-random-api.ml/pokemon/${poke}.png`);
                message.channel.send(pokemon);
                message.channel.stopTyping();
            })
        }
        catch (err){
                message.channel.send("💔 Something went wrong");
                message.channel.stopTyping();
        }
    }
}
