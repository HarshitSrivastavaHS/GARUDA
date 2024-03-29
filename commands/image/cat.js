module.exports = {
    name: 'cat',
    
    usage: '&{prefix}cat',
    description: 'get a random cat pic',
    aliases: [],
    permissions: ['SEND_MESSAGES', "EMBED_LINKS"],
    async execute(message, args, bot, Discord, prefix) {
        message.channel.sendTyping();
        const fetch = require("node-fetch");
        try {
            fetch(`http://aws.random.cat/meow`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                const embed = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                	.setTimestamp()
                    .setFooter("A cute cat")
                    .setImage(`${data.file}`);                    
                message.channel.send({embeds:[embed]});
            }).catch(err=>{
              message.channel.send("💔 Something went wrong");
            })
        }
         catch(err){
                message.channel.send("💔 Something went wrong");
        }
    }
}
