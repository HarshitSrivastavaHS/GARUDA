const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
async function main() {
    let faces = ['Head', 'Tail'];
    let coin = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Flip a coin");
    let face = faces[Math.floor(Math.random()*2)];
    coin.setDescription(`The coin was flipped. It is ${face}.`)
    switch(face) {
        case 'Head': coin.setThumbnail("https://www.pngitem.com/pimgs/m/123-1232373_coin-png-pic-heads-and-tails-indian-coin.png"); break;
        case 'Tail': coin.setThumbnail("https://thumbs.dreamstime.com/b/one-indian-rupee-coin-isolated-white-background-86022284.jpg"); break;    
    }
    return coin;
}
module.exports = {
    name: 'flip',
    usage: '&{prefix}flip',
    description: 'flips a coin',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
        let coin = await main()
        message.channel.send({embeds: [coin]});
    },
    slash: new SlashCommandBuilder()
        .setName("flip")
        .setDescription("flip a coin!"),
    async slashExecute(interaction) {
        interaction.reply({embeds:[await main()]})
    }
}
