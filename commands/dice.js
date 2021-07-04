module.exports = {
    name: 'dice',
    type: 'fun',
    usage: `&{prefix}dice `,
    description: 'gives a random number between 1 and 6 (or 1 and the number provided)',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        let upperlimit = 6;
        if (args[0]&&isNaN(upperlimit)) return message.reply("Invalid argument");
        if (args[0]&&(args[0]>1024||args[0]<2)) return message.channel.send("Argument provided should be between 2 and 1024");
        if (args[0]) upperlimit = args[0];
        let emb = new Discord.MessageEmbed()
         .setColor("GREEN")
         .setTitle("Dice roll")
         .setDescription(`The dice was rolled... It lands on ${Math.floor(1+Math.random()*upperlimit)}`)
         .setTimestamp();
         message.channel.send(emb);
    }
}
