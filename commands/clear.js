module.exports = {
    name: 'clear',
    type: 'utility',
    usage: '&{prefix}clear <Number of messages to be deleted>',
    description: 'deletes the given number of messages',
    aliases: ["purge"],
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));

        if (isNaN(args[0])) {
            message.channel.send("Invalid Syntax!\n```%clear <number of messsages to be deleted>```");
            return;
        }

        if(!(message.member.permissions.has("MANAGE_MESSAGES"))) {
            message.channel.send("<@"+message.member+"> You don't have the required permissions.");
            return;
        }
        var num = parseInt(args[0]);
        if (num<100) {
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
            message.channel.send(`${message.member}, I can only delete a maximum of 99 messages at a time.`)
        }
    }
}
