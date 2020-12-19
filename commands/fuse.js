module.exports = {
    name: 'fuse',
    type: 'fun',
    description: 'fuses user\'s avatar with the mentioned user\'s avatar',
    execute: async (message, args, bot, Discord) => {
        const Canvas = require("canvas");
        const canvas = Canvas.createCanvas(800, 800);
        const mention = message.mentions.users.first();
        const ctx = canvas.getContext("2d");
        const img = await Canvas.loadImage(message.author.displayAvatarURL({format: "jpg", size: 4096}));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const img1 = await Canvas.loadImage(mention.displayAvatarURL({format: "jpg", size: 4096}))
        ctx.globalAlpha = 0.5;
        ctx.drawImage(img1, 0, 0, canvas.width,canvas.height);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "test.png")
        message.channel.send(attachment);
    }
}
