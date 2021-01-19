module.exports = {
    name: 'repeat',
    description: 'repeats whatever the user wants it to repeat',
    usage: "&{prefix}repeat <text>",
    async execute(message, args, bot, Discord, prefix) {
        if (message.content.indexOf(' ') === -1) {
            message.reply("Invalid Syntax! ```\n%repeat <Text to be repeated by the bot>\n```");
            return;
        }
        message.delete();
        const EVERYONE_PATTERN = /@(everyone)/g;
        const HERE_PATTERN = /@(here)/g;
        let x = message.content;
        if (!message.member.permissions.has("MENTION_EVERYONE")) {
            x = x.replace(EVERYONE_PATTERN, "everyone");
            x = x.replace(HERE_PATTERN, "here");
        }
        const reptext = x.substr(x.indexOf(' ')+1);
        message.channel.send(reptext);
    }
}
