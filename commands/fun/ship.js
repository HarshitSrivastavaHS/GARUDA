const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'ship',
    usage: `&{prefix}ship <user 1> [user 2]`,
    description: 'Ship percentage between two users.',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
      let user1 = args[0]?message.mentions.members.filter(m=>args[0].includes(m.user.id)).map(m=>m)[0]:undefined;
      let user2 = args[1]?message.mentions.members.filter(m=>args[1].includes(m.user.id)).map(m=>m)[0]:message.member;
      if (!user1) return message.reply("Please re-run the command with the users you want to ship.");
      let shipPercentage = Math.random()*100;
      let embed = new Discord.MessageEmbed()
      .setColor("#FFC0CB")
      .setTitle("**💗 MATCHMAKING 💗**")
      .setDescription(`${user1.user.tag} 💞 ${shipPercentage} 💞 ${user2.user.tag}`)
      .setFooter("Invite Garuda to your server! (/invite)");
      message.reply({embeds: [embed]});
    },
    slash: new SlashCommandBuilder()
	    .setName('ship')
	    .setDescription('Ship percentage between two users')
      .addUserOption(option =>
	    	option.setName('user')
			    .setDescription('The user you want to use for this ship command')
          .setRequired(true))
      .addUserOption(option =>
	    	option.setName('user2')
			    .setDescription('The second user you want to use for this ship')),
    async slashExecute(interaction) {
      await interaction.deferReply()
      let user1 = interaction.options.getUser("user");
      let user2 = interaction.options.getUser("user2")||interaction.member;
      let shipPercentage = Math.random()*100;
      let embed = new Discord.MessageEmbed()
      .setColor("#FFC0CB")
      .setTitle("**💗 MATCHMAKING 💗**")
      .setDescription(`${user1.user.tag} 💞 ${shipPercentage} 💞 ${user2.user.tag}`)
      .setFooter("Invite Garuda to your server! (/invite)");
      interaction.editReply({embed: [embed]});
    }
}
