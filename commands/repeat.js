module.exports = {
    name: 'repeat',
    description: 'repeats whatever the user wants it to repeat',
    execute(message, args, prefix) {
        if (message.author != "451693463742840842") return message.channel.send("Fixing it. Only the owner can use it right now. Please keep patience :)");
        if (message.content.indexOf(' ') === -1) {
            message.reply("Invalid Syntax! ```\n%repeat <Text to be repeated by the bot>\n```");
            return;
        }
        message.delete();
        console.log(message);
        const reptext = message.content.substr(message.content.indexOf(' ')+1);
        message.channel.send(reptext);
    }
}
