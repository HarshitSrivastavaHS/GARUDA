module.exports = {
    name: 'glist',
    usage: `To end any giveaway: &{prefix}gend <message id/link>\nTo reroll the giveaway started by you: &{prefix}gend\nSecond one will not work if more than 50 messages were sent in that channel after your giveaway has ended`,
    description: 'rerolls an already ended giveaway.',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let ong = bot.giveaways.get(message.guild.id)!=undefined?bot.giveaways.get(message.guild.id):[];
        if (ong.length == 0) return message.reply("No ongoing giveaways in this server");
        let emb = new Discord.MessageEmbed();
        let desc = "Giveaways going on in this server:";
        for (let i = 1; i <= ong.length; i++) {
            if (desc.length>=2000) break;
            desc += `\n${i)} [${ong[3]}](https://discord.com/channels/${ong[1]}/${ong[2]}/${ong[0]})`;
        }
        message.reply({embeds: [emb]});
    }
}
