module.exports = {
    name: 'choose',
    description: 'helps you choose from multiple options',
    usage: "&{prefix}choose <option 1> , <option 2> , [option 3] ... [option n]",
    permissions: ['SEND_MESSAGES', "EMBED_LINKS"],
    aliases: [],
    async execute(message, args, bot, Discord, prefix) {
        if (args.length == 0) return message.reply("You're missing the two mandatory options that are required for the bot to choose from.");
        let options = args.join(" ").split(",")
        if (options.length < 2) {
           options = args.join(" ").split(" ");
           if (options.length < 2) return message.reply("You're missing the two mandatory options that are required for the bot to choode from.");
        }
        let choice = options[Math.floor(Math.random()*options.length)];
        let embed = new Discord.MessageEmbed()
        .setTitle("I choose...")
        .setColor("YELLOW")
        .setTimestamp()
        .setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic:true, size:4096})})
        .setDescription(`**Choice: ${choice}\nOptions: ${options.join(", ")}**`);
        message.channel.send({embeds:[embed]});
    }
}
