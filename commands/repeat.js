module.exports = {
    name: 'repeat',
    description: 'repeats whatever the user wants it to repeat',
    execute(message, args, prefix) {
        if (message.content.indexOf(' ') === -1) {
            message.reply("Invalid Syntax! ```%repeat <Text to be repeated by the bot>```");
            return;
        }
        message.delete();
        const reptext = message.content.substr(message.content.indexOf(' ')+1);
        message.channel.send(reptext);
    }
}
