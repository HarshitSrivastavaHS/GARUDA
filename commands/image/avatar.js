const { SlashCommandBuilder } = require('@discordjs/builders');
let Discord = require("discord.js")
module.exports = {
    name: 'avatar',
    
    usage: `&{prefix}avatar <user's mention (optional)>`,
    description: 'shows the user\'s avatar',
    aliases: ["a", "av"],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        await message.guild.members.fetch();
        const mentionUser = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first():false|| message.guild.members.cache.get(args[0])|| args.length > 0 && message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase()))||message.member;
        const avataremb = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic: true})}`);
        avataremb.setImage(`${mentionUser.user.displayAvatarURL({size: 4096, dynamic: true})}`)
        .setTitle(`${mentionUser.user.tag}'s Avatar`);
        message.channel.send({embeds:[avataremb]});
    },
    slash: new SlashCommandBuilder()
	    .setName('avatar')
	    .setDescription('Returns the profile picture!')
      .addUserOption(option =>
	    	option.setName('user')
			    .setDescription('The user who\'s avatar is to be shown')),
    async slashExecute(interaction) {
      let member = interaction.options.getMember('user')||interaction.member;
      const avataremb = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setAuthor(`${interaction.user.username}`,`${interaction.user.displayAvatarURL({dynamic: true})}`);
        avataremb.setImage(`${member.user.displayAvatarURL({size: 4096, dynamic: true})}`)
        .setTitle(`${member.user.tag}'s Avatar`);
      interaction.reply({embeds: [avataremb]});
    }
}
