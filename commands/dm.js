module.exports = {
    name: 'dm',
    type: 'fun',
    usage: '&{prefix}dm <user @> <message here>',
    description: 'Kicks a user out of the server',
    async execute(message, args, bot, Discord, prefix) {
        if (args.length <= 1) return message.channel.send(`Invalid Syntax. ${prefix}help dm for more info.`)
        const user = message.mentions.users.first();
        const ureg = /user/g;
        message.channel.send(ureg.match(user));
        if (!user) return message.channel.send(`Invalid Syntax. ${prefix}help dm for more jnfo.`);
        const msg = args.slice(1).join(" ");
        if (!msg) return message.channel.send("Please enter the message to be sent.");
        user.send(msg);
        message.channel.send("Message sent successfully.");
        message.delete();
    }
}
