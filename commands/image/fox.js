module.exports = {
    name: 'fox',
    
    usage: '&{prefix}fox',
    description: 'get a random fox pic',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
        message.channel.sendTyping();
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
                message.channel.send({embeds:[embed]});
            }).catch(err=>{message.channel.send("💔 Something went wrong");})
        }
         catch(err){
                message.channel.send("💔 Something went wrong");
        }

    }
}
 
