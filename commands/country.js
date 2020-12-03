module.exports = {
    name: 'country',
    description: 'IN DEVELOPMENET',
    execute(message, args, bot, Discord) {
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
                    .setAuthor(`%country ${code}`)
                    .addFields(
                        { name: "Native Name", value: data.nativeName, inline: true},
                        { name: "Capital" , value: data.capital, inline: true},
                        { name: "Population", value: data.population, inline: true},
                        { name: "Main Currency", value: `${data.currencies[0].name} (${data.currencies[0].symbol})`, inline: true},
                        { name: "Region", value: data.region, inline: true},
                        { name: "Population", value: data.population, inline: true},
                        { name: "Area", value: `${data.area} km`, inline: true}
                    )
                    .setFooter("via restcountries.eu")
                    .setThumbnail(data.flag);
                message.channel.send(country);
            })
        }
        catch (err){
                message.channel.send(":broken-heart: Something went wrong");
        }
    }
}
