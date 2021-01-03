module.exports = {
    name: 'dm',
    type: 'fun',
    usage: '&{prefix}dm <user @> <message here>',
    description: 'Kicks a user out of the server',
    async execute(message, args, bot, Discord, prefix) {
        if (args.length <= 1) return message.channel.send(`Invalid Syntax. ${prefix}help dm for more info.`)
        const user = message.mentions.users.first();
        const mention_reg = /<@!?(\d{17,19})>/g;
        if (!user || !(args[0].match(mention_reg))) return message.channel.send(`Invalid Syntax. ${prefix}help dm for more jnfo.`);
        const msg = args.slice(1).join(" ");
        if (!msg) return message.channel.send("Please enter the message to be sent.");
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        .setDescription(msg)
        .setTimestamp();
        user.send(embed);
        message.channel.send("Message sent successfully.");
        message.delete();
    }
}
