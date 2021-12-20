const Canvas = require("discord-canvas");
const { Message } = require("discord.js");

module.exports = {
    async execute(member, welcomeCH, Discord) {
      await member.guild.members.fetch();
      let random = Math.floor(Math.random()*6+1);
      const image = await new Canvas.Welcome()
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
        .setGuildName(member.guild.name)
        .setAvatar(member.user.displayAvatarURL({format: "jpg", size: 4096}))
        .setText("message", "Welcome to {server}")
        .setText("member-count", `Humans: ${member.guild.members.cache.filter(m=>!m.user.bot).size} Bots: ${member.guild.members.cache.filter(m=>m.user.bot).size}`)
        .setColor("border", "#8015EA")
        .setColor("username-box", "#8015EA")
        .setColor("discriminator-box", "#8015EA")
        .setColor("message-box", "#8015EA")
        .setColor("title", "#8015EA")
        .setColor("avatar", "#8015EA")
        .setBackground(`util/welcome${random}.jpg`)
        .toAttachment();
        
      const attachment = new Discord.MessageAttachment(image.toBuffer(), "welcome-image.png");

      let emb = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setTitle("Welcome")
      .setImage(attachment);
      
      welcomeCH.send({content:`Welcome to **${member.guild.name}**, <@${member.user.id}>`,embeds: [emb], files:[attachment]}).catch(e=>{});
    }
}


  
