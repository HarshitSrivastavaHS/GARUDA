const Canvas = require("canvas");

module.exports = {
    async execute(member, welcomeCH, Discord) {
      const canvas = Canvas.createCanvas(700, 250);
      const ctx = canvas.getContext("2d");
      const background = await Canvas.loadImage('./util/welcome.png');
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, 700, 250);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      let text = `Welcome to ${member.guild.name}`;
      let fontSize = 50;
      do {
		    ctx.font = `bold ${fontSize -= 1}px sans-serif`;
	    } while (ctx.measureText(text).width > canvas.width - 260);
	    ctx.fillStyle = '#edf2f4';
	    ctx.fillText(text, 225, canvas.height / 3.5);
      fontSize = 50;
      text = member.user.tag;
      do {
		    ctx.font = `bold ${fontSize -= 1}px sans-serif`;
	    } while (ctx.measureText(text).width > canvas.width - 300);
	    ctx.fillStyle = '#edf2f4';
	    ctx.fillText(text, 250, canvas.height / 1.8);
      ctx.font = `bold 28px sans-serif`;
      ctx.fillText(`Member #${member.guild.memberCount}`, 250+ctx.measureText(`Member #${member.guild.memberCount}`).width/2, canvas.height / 3.5 + canvas.height / 1.8 - 10);
      ctx.beginPath();
	    ctx.arc(125, 125, 75, 0, Math.PI * 2, true);
    	ctx.closePath();
      ctx.stroke(); 
	    ctx.clip();
      const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
      ctx.drawImage(avatar, 50, 50, 150, 150);
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');  
      welcomeCH.send(`Welcome to **${member.guild.name}**, <@${member.user.id}>`,attachment);
    }
}


  