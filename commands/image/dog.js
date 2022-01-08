module.exports = {
    name: 'dog',
    
    usage: '&{prefix}dog',
    description: 'get a random dog pic',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        message.channel.sendTyping();
        const fetch = require("node-fetch");
        try {
            fetch(`https://dog.ceo/api/breeds/image/random`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                const embed = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                	.setTimestamp()
                    .setFooter("A cute dog")
                    .setImage(`${data.message}`);                    
                message.channel.send({embeds: [embed]});
            })
        }
         catch(err){
                message.channel.send("💔 Something went wrong");
        }
    }
}
 
