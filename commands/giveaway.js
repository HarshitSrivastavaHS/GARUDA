module.exports = {
    name: 'giveaway',
    description: 'to start a giveaway',
    execute: async (message, args, bot, Discord) => {
      if (!args[0]) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      let time = args[0][1].toLowerCase;
      if (!time=="d"&&!time=="d"&&!time=="s") return message.channel.send("Invalid Syntax!\nFormat for time: 1d = 1day, 1m = 1 minute, 1s = 1 second\nExample:```%giveaway 1d Prize```");
      let timee = args[0].substr(0, str.length-1)
      if (isNaN(timee)) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      let prize = args.slice(1).join(" ");
      if (!prize) return message.channel.send("No prize specified. Please specify after the time.");
      let ms = 0;
      
      let giveawayEM = new Discord.MessageEmbed()
      .setTitle("New Giveaway")
      .setColor("PURPLE")
      .setDescription(`Hosted by ${message.author.tag} | Time ${time} | Prize ${prize}`)
      //.setTimestamp(Date.now() + ms);
      let msg = await message.channel.send(":tada:GIVEAWAY:tada:"+giveawayEM);
      msg.react("🎉");
    }
}
