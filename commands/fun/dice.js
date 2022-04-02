const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
async function main(upperlimit) {
    let emb = new Discord.MessageEmbed()
         .setColor("GREEN")
         .setTitle("Number roll")
         .setDescription(`The number rolled is ${Math.floor(1+Math.random()*upperlimit)}`)
         .setTimestamp();
    return emb;
}
module.exports = {
    name: 'roll',    
    usage: `&{prefix}dice `,
    description: 'gives a random number between 1 and 6 (or 1 and the number provided)',
    aliases: ["dice"],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        let upperlimit = 6;
        if (args[0]&&isNaN(args[0])) return message.reply("Invalid argument");
        if (args[0]&&(args[0]>1024||args[0]<2)) return message.channel.send("Argument provided should be between 2 and 1024");
        if (args[0]) upperlimit = args[0];
        message.channel.send({embeds: [await main(upperlimit)]});
    },
    slash: new SlashCommandBuilder()
	    .setName('roll')
	    .setDescription('Roll a dice!')
      .addStringOption(option =>
	    	option.setName('limit')
			    .setDescription('How many faces does the dice have? ')
          .setRequired(true)),
    async slashExecute(interaction) {
      let limit = interaction.options.getString('limit');
      if (limit < 0 || limit > 1024) {
          return interaction.reply({content: "The dice can have at most 1024 sides", ephemeral: true})
      }
      interaction.reply({embeds: [await main(limit)]});
    }
}
