const fetch = require('node-fetch');


module.exports = {
    name: '8ball',
    type: 'fun',
    usage: `&{prefix}8ball <question>`,
    description: 'ask yes/no question from the bot',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
         const body = await fetch('https://api.cryptons.ga/v1/fun/8ball')
    .then(res => res.json())
        
        let question = args.join(" ");
        question = question[0].toUpperCase()+question.substr(1, question.length);
        const embed = new Discord.MessageEmbed()
        .setTitle(question)
        .setFooter(`Asked by ${message.author.username}`)
        .setTimestamp()
        .setThumbnail("https://www.horoscope.com/images-US/games/game-magic-8-ball-no-text.png")
        .setDescription(`${body.answer}`)
        .setColor("RED")
       
        message.channel.send("**:magic_wand: Magic 8 Ball :magic_wand:**", embed);
    }
}
