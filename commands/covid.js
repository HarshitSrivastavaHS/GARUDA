module.exports = {
    name: 'covid',
    description: 'tells some details of a country.',
    execute(message, args, bot, Discord) {
        const code = args[0];
        const fetch = require("node-fetch");
        try {
            fetch(`https://api.covid19api.com/summary`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                const covid = new Discord.MessageEmbed()
                    .setColor("#D441EE")
                    .setTitle('test')
                    .setAuthor(``,``)
                    .addFields(
                        { name: "Native Name", value: data.Global.TotalConfirmed, inline: true}
                        /*{ name: "Capital" , value: data.capital, inline: true},
                        { name: "Population", value: data.population, inline: true},
                        { name: "Main Currency", value: `${data.currencies[0].name} (${data.currencies[0].symbol})`, inline: true},
                        { name: "Region", value: data.region, inline: true},
                        { name: "Demonym", value: data.demonym, inline: true},
                        { name: "Area", value: `${data.area} km`, inline: true}*/
                    )
                    .setTimestamp()
                    .setFooter('')
                    .setThumbnail(``);
                message.channel.send(covid);
            })
        }
        catch (err){
                message.channel.send(":broken-heart: Something went wrong");
        }
    }
}
