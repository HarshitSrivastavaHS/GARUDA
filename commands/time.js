module.exports = {
    name: 'time',
    description: 'IN DEVELOPMENET',
    execute(message, args, bot) {
        const date = new Date().getTimezoneOffset();
        message.channel.send("Still in development");
        message.channel.send("Test messages below:::Please Ignore");
        message.channel.send(date);
    }
}
