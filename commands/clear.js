module.exports = {
    name: 'clear',
    type: 'utility',
    usage: '&{prefix}clear <Number of messages to be deleted>',
    description: 'deletes the given number of messages',
    async execute(message, args, bot, Discord, prefix) {

        if (isNaN(args[0])) {
            message.channel.send("Invalid Syntax!\n```%clear <number of messsages to be deleted>```");
            return;
        }

        if(!(message.member.permissions.has("MANAGE_MESSAGES"))) {
            message.channel.send("<@"+message.member+"> You don't have the required permissions.");
            return;
        }
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return message.channel.send("I don't have the required permissions.");
        var num = parseInt(args[0]);
        if (num<=75) {
            message.channel.bulkDelete(num+1, true);
            message.channel.send(`Deleting ${num} messages`)
            .then(msg => {
                msg.delete({ timeout: 3000 })
            })
        }
        else if(!(parseInt(args[0])>0)){
            message.channel.send(`${message.member}, Please enter a number greater than 0.`)
        }
        else {
            message.channel.send(`${message.member}, I can only delete less than 75 messages right now.`)
        }
    }
}
