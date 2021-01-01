module.exports = {
    name: 'cat',
    type: 'fun',
    usage: '&{prefix}cat',
    description: 'get a random cat pic',
    async execute(message, args, bot, Discord, prefix) {
        
        const fetch = require("node-fetch");
        try {
            fetch(`https://api.thecatapi.com/v1/images/search`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                const embed = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                	.setTimestamp()
                    .setFooter("via TheCatApi")
                    .setImage(`${data[0].url}`);                    
                message.channel.send(embed);
            })
        }
         catch(err){
                message.channel.send(":broken-heart: Something went wrong");
        }
    }
}
