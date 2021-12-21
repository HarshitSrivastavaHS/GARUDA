const Canvas = require("discord-canvas");
const Discord = require("discord.js");
module.exports = {
    async execute(member, welcomeCH, greeting) {
      await member.guild.members.fetch();
      let colors = ["#8a2be2", "#8015EA", "#FF4040", "#003366", "#FFFFFF"];
      let random = Math.floor(Math.random()*5+1);
      const image = await new Canvas.Welcome()
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
        .setGuildName(member.guild.name)
        .setAvatar(member.user.displayAvatarURL({format: "jpg", size: 4096}))
        .setText("message", "Welcome to {server}")
        .setText("member-count", `Humans: ${member.guild.members.cache.filter(m=>!m.user.bot).size} Bots: ${member.guild.members.cache.filter(m=>m.user.bot).size}`)
        .setColor("border", colors[random-1])
        .setColor("username-box", colors[random-1])
        .setColor("discriminator-box", colors[random-1])
        .setColor("message-box", colors[random-1])
        .setColor("title", colors[random-1])
        .setColor("avatar", colors[random-1])
        .setBackground(`util/welcome${random}.jpg`)
        .toAttachment();
        
      const attachment = new Discord.MessageAttachment(image.toBuffer(), "welcome-image.png");
      
      welcomeCH.send({content:greeting?greeting:`Welcome to **${member.guild.name}**, <@${member.user.id}>`, files:[attachment]}).catch(e=>{console.log(e)});
    }
}


  
