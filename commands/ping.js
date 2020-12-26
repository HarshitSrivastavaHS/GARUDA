module.exports = {
    name: 'ping',
    description: 'This is the ping command',
    async execute(message, args, bot, Discord, prefix) {
        const cnt = new Date().getTime();
        const ping = cnt - message.createdAt;
        message.channel.send("Pong!\nYour Ping is `"+ping+"ms`");
    }
}