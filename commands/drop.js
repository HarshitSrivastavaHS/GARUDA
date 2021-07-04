module.exports = {
    name: 'drop',
    type: 'utility',
    usage: `&{prefix}drop <prize>`,
    description: 'first person to react within 30 seconds wins.',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (args.length<1) return message.channel.send("Re-run the command but this time actually mention the prize.");
        const prize = args.join(" ");
        let embed = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle(prize)
        .setDescription(`The first one to react with 🎉 wins!\nMaximum Time: 30 seconds.\nHosted By ${message.member}.`)
        .setFooter("Drop");
        let msg = await message.channel.send("**🎉 PRIZE DROP 🎉**",embed);
        message.delete();
        let winner;
        msg.react("🎉");
        msg.awaitReactions((reaction, user) => user.id != bot.user.id && user.id != message.author.id &&reaction.emoji.name == '🎉',
          { max: 1, time: 30000 }).then((collected) => {
            collected.map(el=>el.users.cache.map(u=>winner = !u.bot?u:winner));
            message.channel.send(`Congratulations <@${winner.id}>!! You have won the **${prize}**.`)
            embed.setColor("GREEN")
            .setDescription(`Winner: ${winner}\nHosted By ${message.member}.`)
            msg.edit("**🎉 DROP ENDED 🎉**",embed);
          }).catch(() => {
            message.channel.send('No one reacted within 30 seconds.');
            embed.setColor("RED")
            .setDescription(`Nobody reacted\nHosted By ${message.member}.`)
            msg.edit("**🎉 DROP ENDED 🎉**",embed);
        });
    }
}
