module.exports = {
    name: 'announce',
    type: 'utility',
    usage: `%announce <#channel> <announcement>`,
    description: 'does an announcement',
    execute(message, args, bot, Discord) {
        if (args.length<=1) return message.channel.send("Invalid Syntax. Do `%help announce` for further details");
        if (!args[0].channels) return message.channel.send("Hello World!");
    }
}
