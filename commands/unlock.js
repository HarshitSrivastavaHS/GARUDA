module.export = {
    name: "unlock",
    type: 'moderation',
    usage: '&{prefix}unlock',
    description: 'sets AFK.',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
	    let channel = message.channel;
	    if (args[0]&&message.mentions.channels.first()&&args[0].includes(message.mentions.channels.first().id))
	    {
	        channel = message.mentions.channels.first();
	        args = args.slice(1);
	    }
            if(!channel.permissionsFor(message.member).has("MANAGE_CHANNEL")) {
                message.channel.send("You don't have the required permissions.");
                return;
            }
	    if (channel.permissionsFor(channel.guild.roles.everyone).has("SEND_MESSAGES")) return message.channel.send(`${channel} is not locked`);
	    channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
	    message.channel.send(`Successfully unlocked ${channel}`);
	    let emb = new Discord.MessageEmbed()
	     .setColor("GREEN")
	     .setTitle("Channel unlocked")
	     .setDescription(`Unlocked this channel${args.length>0?"\nReason: "+args.join(" "):""}`)
	     .setTimestamp();
	    channel.send(emb);
    }
}
