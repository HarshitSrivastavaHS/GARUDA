module.exports = {
    name: 'covid',
    type: 'info',
    usage: '&{prefix}covid',
    description: 'shows covid 19 stats',
    aliases: [],
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
        const code = args[0];
        const fetch = require("node-fetch");
        try {
            fetch(`https://disease.sh/v3/covid-19/all`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                const covid = new Discord.MessageEmbed()
                    .setColor("#D441EE")
                    .setTitle('COVID-19 Stats')
                    .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL()}`)
                    .addFields(
                        { name: "Total Cases", value: data.cases, inline: true},
                        { name: "Active Cases", value: data.active, inline: true},
                        { name: "No. of Deaths", value: data.deaths, inline: true},
                        { name: "No. of People Recovered", value: data.recovered, inline: true}
                        )
                    .setTimestamp()
                    .setFooter('via disease.sh')
                    .setThumbnail(`https://cdn.pixabay.com/photo/2020/04/29/07/54/coronavirus-5107715_1280.png`);
                message.channel.send(covid);
            })
        }
        catch (err){
                message.channel.send(":broken-heart: Something went wrong");
        }
    }
}
