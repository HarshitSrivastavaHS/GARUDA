const Discord = require("discord.js")
const {SlashCommandBuilder} = require("@discordjs/builders")
function getEm(bot){
  const em = new Discord.MessageEmbed()
    .setTitle("Want to add me to your server? Use the link below!")
    .setColor("BLUE")
    .addFields({
      name: "**Invite me**", value: "**[Click here to invite](https://discord.com/api/oauth2/authorize?client_id=777840690515279872&permissions=8&scope=applications.commands%20bot)**"
    },
    { 
      name: "**Join the support Server**" , value: "**[Click here to join](https://discord.gg/sBe3jNSdqN)**"
    })
    .setThumbnail(bot.user.displayAvatarURL({size: 4096}));
  return em;
}
      
module.exports = {
    name: 'invite',
    usage: '&{prefix}invite',
    description: 'gives bot\'s invite link',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        let em = getEm(bot);
        message.channel.send({embeds:[em]});
    },
    slash: new SlashCommandBuilder()
      .setName("invite")
      .setDescription("Get bot's invite"),
    slashExecute(interaction) {
      interaction.reply({embeds:[getEm(interaction.client)]});
    }
}
