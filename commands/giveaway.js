module.exports = {
    name: 'giveaway',
    description: 'to start a giveaway',
    execute: async (message, args, bot, Discord) => {
      if (!args[0]) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      let time = args[0][1].toLowerCase;
      if (!time=="d"&&!time=="d"&&!time=="s") return message.channel.send("Invalid Syntax!\nFormat for time: 1d = 1day, 1m = 1 minute, 1s = 1 second\nExample:```%giveaway 1d Prize```");
      let timee = args[0].substr(0, args[0].length-1)
      if (isNaN(timee)) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      let prize = args.slice(1).join(" ");
      if (!prize) return message.channel.send("No prize specified. Please specify after the time.");
      let ms = 0;
      
      let giveawayEM = new Discord.MessageEmbed()
      .setTitle(prize)
      .setColor("PURPLE")
      .setFooter("Ends at")
      .setDescription(`React with :tada: to enter!\nTime ${time}\nHosted by ${message.author.tag}`)
      //.setTimestamp(Date.now() + ms);
      message.channel.send(":tada:GIVEAWAY:tada:");
      let msg = await message.channel.send(giveawayEM);
      msg.react("🎉");
    }
}
