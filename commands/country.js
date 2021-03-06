module.exports = {
    name: 'country',
    type: 'info',
    usage: '&{prefix}country <country code>',
    description: 'tells some details of a country.',
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
        if (code===undefined) {
            message.channel.send("%country <country code>"); 
            return;
        }
        const fetch = require("node-fetch");
        try {
            fetch(`https://restcountries.eu/rest/v2/alpha/${code}`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                if (data.name===undefined){
                    message.reply("Please enter a valid country code");
                    return;
                }
                const country = new Discord.MessageEmbed()
                    .setColor("#D441EE")
                    .setTitle(data.name)
                    .setAuthor(`%country ${code}`,`https://www.countryflags.io/${data.alpha2Code}/flat/64.png`)
                    .addFields(
                        { name: "Native Name", value: data.nativeName, inline: true},
                        { name: "Capital" , value: data.capital, inline: true},
                        { name: "Population", value: data.population, inline: true},
                        { name: "Main Currency", value: `${data.currencies[0].name} (${data.currencies[0].symbol})`, inline: true},
                        { name: "Region", value: data.region, inline: true},
                        { name: "Demonym", value: data.demonym, inline: true},
                        { name: "Area", value: `${data.area} km`, inline: true}
                    )
                	.setTimestamp()
                    .setFooter("via restcountries.eu")
                    .setThumbnail(`https://www.countryflags.io/${data.alpha2Code}/flat/64.png`);
                message.channel.send(country);
            })
        }
        catch (err){
                message.channel.send(":broken-heart: Something went wrong");
        }
    }
}
