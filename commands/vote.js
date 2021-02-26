module.exports = {
    name: 'vote',
    usage: '&{prefix}vote',
    description: 'support the bot by voting for the bot.',
    async execute(message, args, bot, Discord, prefix) {
       const emb = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle("Vote for GARUDA")
        .setDescription("Thank you for using this command. You can [vote for Garuda on Discord Bot List](https://discordbotlist.com/bots/garuda/upvote).\nYou can vote for the bot every 12 hours!.")
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter("Thank You!");
       message.channel.send(emb);
    }
}
