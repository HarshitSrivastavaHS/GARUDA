module.exports = {
    name: 'glist',
    usage: `To end any giveaway: &{prefix}gend <message id/link>\nTo reroll the giveaway started by you: &{prefix}gend\nSecond one will not work if more than 50 messages were sent in that channel after your giveaway has ended`,
    description: 'rerolls an already ended giveaway.',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        if (message.author.id != "451693463742840842") return messasge.reply("in development");
        let ong = bot.giveaways.get(message.guild.id)!=undefined?bot.giveaways.get(message.guild.id):[];
        if (ong.length == 0) return message.reply("No ongoing giveaways in this server");
        let emb = new Discord.MessageEmbed();
        let desc = "Giveaways going on in this server:";
        for (let i = 0; i < ong.length; i++) {
            if (desc.length>=2000) break;
            desc += `\n» [${ong[i][3]}](https://discord.com/channels/${ong[i][1]}/${ong[i][2]}/${ong[i][0]})`;
        }
        emb.setDescription(desc)
        .setColor("GREEN")
        .setTitle("Giveaways")
        .setThumbnail(bot.user.displayAvatarURL());
        message.reply({embeds: [emb]});
    }
}
