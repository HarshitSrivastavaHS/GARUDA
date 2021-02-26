module.exports = {
	name: 'fuse',
	type: 'fun',
	usage: "&{prefix}fuse <user's mention>\n&{prefix}fuse <user's mention> <another user's mention>",
	description: "fuses user's avatar with the mentioned user's avatar",
	async execute(message, args, bot, Discord, prefix) {
		const Canvas = require('canvas');
		const canvas = Canvas.createCanvas(800, 800);
		const mention = message.mentions.users.first();
		if (!mention)
			return message.channel.send(
				'Please mention the user to fuse your avatar with or mention two user\'s to fuse their avatars.'
			);

    		let string;
    		const ctx = canvas.getContext('2d');
    		let attachment;
    		let address;
    		message.channel.startTyping();
   		 let user2 = message.mentions.users.array().length>1?message.mentions.users.array()[1]:null;
    
 		   if (mention == user2) {
		      user2 = null;
		    }
	
		    if (!user2) {
 		     if (mention == message.author){
  		      message.channel.stopTyping();
			  return message.channel.send('You cannot fuse your Avatar with itself.');
   		   }
      
		  const img = await Canvas.loadImage(
			  message.author.displayAvatarURL({ format: 'jpg', size: 4096 })
		  );
		  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		  const img1 = await Canvas.loadImage(
			mention.displayAvatarURL({ format: 'jpg', size: 4096 })
		  );
		  ctx.globalAlpha = 0.5;
		  ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);
		  attachment = new Discord.MessageAttachment(
		  	canvas.toBuffer(),
		  	`${message.author.id}${mention.id}.png`
		  );

   		   address = `${message.author.id}${mention.id}.png`;

   		   string = `${message.author.username}'s and ${mention.username}'s Avatar were fused together.`;
      
   		 }

   		 else {
		  const img = await Canvas.loadImage(
			  user2.displayAvatarURL({ format: 'jpg', size: 4096 })
		  );
		  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		  const img1 = await Canvas.loadImage(
			mention.displayAvatarURL({ format: 'jpg', size: 4096 })
		  );
		  ctx.globalAlpha = 0.5;
		  ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);
		  attachment = new Discord.MessageAttachment(
		  	canvas.toBuffer(),
		  	`${mention.id}${user2.id}.png`
		  );
    		  address = `${mention.id}${user2.id}.png`;
  		    string = `${mention.username}'s and ${user2.username}'s Avatar were fused together.`
      
 		   }
 		   const embed = new Discord.MessageEmbed()
  		    .setTitle(string)
  		    .setColor("YELLOW")
   		   .attachFiles(attachment)
   		   .setImage(`attachment://${address}`);
   		   message.channel.send(embed);
			message.channel.stopTyping();
	}
};
