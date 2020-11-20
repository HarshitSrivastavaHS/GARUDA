module.exports = {
    name: 'repeat',
    description: 'repeats whatever the user wants it to repeat',
    execute(message, args, prefix) {
        message.delete();
        const reptext = message.content.substr(message.content.indexOf(' ')+1);
        message.channel.send(reptext);
    }
}