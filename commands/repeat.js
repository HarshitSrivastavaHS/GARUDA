module.exports = {
    name: 'repeat',
    description: 'repeats whatever the user wants it to repeat',
    usage: "&{prefix}repeat <text>",
    permissions: ['SEND_MESSAGES'],
    aliases: ["say"],
    async execute(message, args, bot, Discord, prefix) {
        
        
        if (message.content.indexOf(' ') === -1) {
            message.reply("Invalid Syntax! ```\n%repeat <Text to be repeated by the bot>\n```");
            return;
        }
        
        let x = Discord.Util.cleanContent(args.join(" "), message);
        x = Discord.Util.removeMentions(x);
        message.channel.send(x);
        if (message.deletable)
            message.delete();

    }
}
