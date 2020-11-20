module.exports = {
    name: 'clear',
    description: 'deletes the given number of messages',
    execute(message, args) {
        const num = args.join("");

        if (isNaN(num)) {
            message.channel.send("Invalid Syntax!\n```%clear <number of messsages to be deleted>```");
            return;
        }

        if(!(message.member.permissions.has("MANAGE_MESSAGES"))) {
            message.channel.send("<@"+message.member+"> You don't have the required permissions.");
            return;
        }

        if (num>0 && num<=50) {
            message.channel.bulkDelete(num+1);
            message.channel.send(`Deleting ${num} messages`)
            .then(msg => {
                msg.delete({ timeout: 3000 })
            })
        }
        else if(!(num>0)){
            message.channel.send(`${message.member}, Please enter a number greater than 0.`)
        }
        else {
            message.channel.send(`${message.member}, I can only delete less than 50 messages right now.`)
        }
    }
}
