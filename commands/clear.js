module.exports = {
    name: 'clear',
    type: 'utility',
    usage: '&{prefix}clear <Number of messages to be deleted>',
    description: 'deletes the given number of messages. Some flags that can be used are:\n\`--human\` |\`--h\`: To Delete messages sent by humans only.\n\`--bot\` | \`--b\`: to delete messages sent by bots only.',
    aliases: ["purge", "nuke"],
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
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
	    let msg = await message.channel.messages.fetch({limit: num+1});
	    if (args[1]) {
	        switch (args[1].toLowerCase()) {
			case '--h':
			case '--human': msg = msg.filter((m)=> !m.author.bot && !m.pinned); break;
			case '--b':
			case '--bot': msg = msg.filter((m)=>m.author.bot && !m.pinned); message.delete(); break;
			default: return message.channel.send("Invalid flag");
	        }
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
