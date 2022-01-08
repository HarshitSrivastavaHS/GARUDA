module.exports = {
    name: 'pop',
    
    usage: `&{prefix}pop`,
    aliases: [],
    description: 'Starts a pop game. The first one to find and send the hidden word wins!',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
        
        let str = "";
            let row = 7, col = 7;
            let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let word = ""
            for (let k = 1; k<=3; k++) {
                word += chars[Math.floor(Math.random()*chars.length)]
            }
            let rp = Math.floor((Math.random() * row) + 1), cp = Math.floor((Math.random() * col) + 1);
            for (let i = 1; i<=row; i++) {
                for (let j = 1; j<=col; j++) {
                    if (i == rp && j == cp)
                        str += `||**\`${word}\`**|| `
                    else
                        str+="||`pop`|| "
                }
                str+="\n";
            }
            let newStr = str.replace(/\|\|/g, "")
            let game = new Discord.MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Pop game started")
            .setDescription(str)
            .setTimestamp();
            filter = (m)=>{return m.content == word}
            let msg = await message.channel.send({content:"**Find the hidden word. The first one to send it in the chat wins! (Case-Sensitive)**",embeds:[game]})
                message.channel.awaitMessages({filter,max: 1, time: 45000, errors: ["time"]})
                .then((collected)=>{
                    let winner = collected.first()
                    let game = new Discord.MessageEmbed()
                    .setColor("#37ea48")
                    .setTitle(`${winner.author.username} has won!`)
                    .setDescription(newStr)
                    .setTimestamp();
                    msg.edit({content:`**<@${winner.author.id}> has won!**`, embeds:[game]});
                })
                .catch((err)=>{
                    let game = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle("Looks like nobody won")
                    .setDescription(newStr)
                    .setTimestamp();
                    msg.edit({content:"**Either nobody messaged or nobody got the correct answer.**",embeds:[game]})
                })
        
    }
}
