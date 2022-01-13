module.exports = {
    name: 'country',
    
    usage: '&{prefix}country <country code>',
    description: 'tells some details of a country.',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
       let code = args[0];
        if (code===undefined) {
            message.channel.send("%country <country alpha code>"); 
            return;
        }
        code = encodeURIComponent(code);
        const fetch = require("node-fetch");
        try {
            fetch(`https://restcountries.com/v3.1/alpha/${code}`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                data = data[0]
                if (!data){
                    message.reply("Please enter a valid country code");
                    return;
                }
                let currency = data.currencies[Object.keys(data.currencies)[0]]
                const country = new Discord.MessageEmbed()
                    .setColor("YELLOW")
                    .setTitle(data.name.common)
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 4096})})
                    .addFields(
                        { name: "Official Name", value: `${data.name.official}`, inline: true},
                        { name: "Capital" , value: `${data.capital}`, inline: true},
                        { name: "Population", value: `${data.population}`, inline: true},
                        { name: "Main Currency", value: `${currency.name} (${currency.symbol})`, inline: true},
                        { name: "Region", value: `${data.region}`, inline: true},
                        { name: "Dialing code", value: `${data.idd.root + data.idd.suffixes[0]} ${data.idd.suffixes.length>1?", etc.":""}`, inline: true},
                        { name: "Area", value: `${data.area} sq km`, inline: true}
                    )
                	.setTimestamp()
                    .setFooter("via restcountries.eu")
                    .setImage(data.flags.png);
                message.channel.send({embeds:[country]});
            })
        }
        catch (err){
                message.channel.send(":broken-heart: Something went wrong");
        }
    }
}
