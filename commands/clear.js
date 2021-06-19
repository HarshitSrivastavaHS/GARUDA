module.exports = {
    name: 'clear',
    type: 'utility',
    usage: '&{prefix}clear <Number of messages to be deleted>',
    description: 'deletes the given number of messages',
    aliases: ["purge"],
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
	if (message.author.id != "451693463742840842") return message.reply("Disabled for updates");
        if (isNaN(args[0])) {
            message.channel.send("Invalid Syntax!\n```%clear <number of messsages to be deleted> [--flags]```");
            return;
        }

        if(!(message.member.permissions.has("MANAGE_MESSAGES"))) {
            message.channel.send("<@"+message.member+"> You don't have the required permissions.");
            return;
        }
        var num = parseInt(args[0]);
        if (num<100) {
	    let msg = await message.channel.messages.fetch({limit: num+1}).toArray();
	    if (args[1]) {
	        switch (args[1]) {
			case '--human': msg = msg.filter((m)=> !m.author.bot && !m.pinned); break;
			case '--bot': msg = msg.filter((m)=>m.author.bot && !m.pinned); break;
			default: return message.channel.send("Invalid flag");
	         }
		 msg.push(message);
	    }
            message.channel.bulkDelete(msg, true);
            message.channel.send(`Deleting ${msg.size} messages`)
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
