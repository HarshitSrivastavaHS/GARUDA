module.exports = {
    name: 'kick',
    type: 'moderation',
    description: 'Kicks a user out of the server',
    async execute(message, args, bot, Discord, prefix) {
        if (args.length <= 1) return message.channel.send(`Invalid Syntax. ${prefix}help dm for more info.`)
        const user = args[0].mentions.members.first();
        if (!user) return message.channel.send(`Invalid Syntax. ${prefix}help dm for more jnfo.`);
        const msg = args.slice(1).join(" ");
        if (!msg) return message.channel.send("Please enter the message to be sent.");
        user.send(msg);
        message.channel.send("Message sent successfully.");
        message.delete();
    }
}
