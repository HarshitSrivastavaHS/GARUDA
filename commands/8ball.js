module.exports = {
    name: '8ball',
    type: 'fun',
    usage: `&{prefix}8ball <question>`,
    description: 'ask yes/no question from the bot',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        const replies = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes – definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
        if (args.length < 2) return message.channel.send("Please ask a full question");
        const opt = Math.floor(Math.random()*replies.length);
        let question = args.join(" ");
        question = question[0].toUpperCase()+question.substr(1, question.length);
        const embed = new Discord.MessageEmbed()
        .setTitle(question)
        .setFooter(`Asked by ${message.author.username}`)
        .setTimestamp()
        .setThumbnail("https://www.horoscope.com/images-US/games/game-magic-8-ball-no-text.png")
        .setDescription(`\`${replies[opt]}\``);
        if (opt<10) {
           embed.setColor("GREEN");
        }
        else if (opt >= 10 && opt<15) {
           embed.setColor("YELLOW");
        }
        else {
           embed.setColor("RED");
        }
        message.channel.send("**:magic_wand: Magic 8 Ball :magic_wand:**", embed);
    }
}
