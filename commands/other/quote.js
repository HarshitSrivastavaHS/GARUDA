module.exports = {
    name: 'quote',
    usage: '&{prefix}quote',
    description: 'get a random quote',
    aliases: ["thought", "quotes"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        message.channel.sendTyping();
        const fetch = require("node-fetch");
        try {
            fetch(`http://www.famous-quotes.uk/api.php?id=random`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                message.channel.send(`**${data[0][1]}** - ${data[0][2]}`);
            }).catch(err=>{message.channel.send("💔 Something went wrong");})
        }
         catch(err){
                message.channel.send("💔 Something went wrong");
        }

    }
}
