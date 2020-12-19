module.exports = {
    name: 'fuse',
    type: 'fun',
    description: 'fuses user\'s avatar with the mentioned user\'s avatar',
    execute: async (message, args, bot, Discord) => {
        const Canvas = require("canvas");
        const canvas = Canvas.createCanvas(800, 800);
        const mention = message.mentions.users.first();
        if (!mention) return message.channel.send("Please mention the user to fuse your avatar with.");
        if (mention == message.author) return message.channel.send("You cannot fuse your Avatar with itself.");
        const ctx = canvas.getContext("2d");
        const img = await Canvas.loadImage(message.author.displayAvatarURL({format: "jpg", size: 4096}));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const img1 = await Canvas.loadImage(mention.displayAvatarURL({format: "jpg", size: 4096}))
        ctx.globalAlpha = 0.5;
        ctx.drawImage(img1, 0, 0, canvas.width,canvas.height);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${message.author.username}${mention.username}.png`)
        message.channel.send(`${message.author.username}'s and ${mention.username}'s Avatar were fused together.`, attachment);
    }
}
