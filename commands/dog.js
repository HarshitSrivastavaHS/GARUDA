module.exports = {
    name: 'dog',
    type: 'fun',
    usage: '&{prefix}dog',
    description: 'get a random dog pic',
    async execute(message, args, bot, Discord, prefix) {
        message.channel.startTyping();
        const fetch = require("node-fetch");
        try {
            fetch(`https://some-random-api.ml/img/dog`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                const embed = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                	.setTimestamp()
                    .setFooter("A cute dog")
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
 
