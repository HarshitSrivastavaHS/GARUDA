module.exports = {
    name: 'giveaway',
    description: 'to start a giveaway',
    execute: async (message, args, bot, Discord) => {
      if (!args[0]) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      let time = args[0].toLowerCase();
      if (!time.endsWith("d")&&!time.endsWith("m")&&!time.endsWith("s")) return message.channel.send("Invalid Syntax!\nFormat for time: 1d = 1day, 1m = 1 minute, 1s = 1 second\nExample:```%giveaway 1d Prize```");
      if (isNaN(time[0])) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      let prize = args.slice(1).join(" ");
      if (!prize) return message.channel.send("No prize specified. Please specify after the time.");
        
      let giveawayEM = new Discord.MessageEmbed()
      .setTitle("New Giveaway")
      .setColor("PURPLE")
      .setDescription(`Hosted by ${message.author.id} | Time ${time} | Prize ${prize}`)
      .setTimestamp(Date.now + ms(time));
      let msg = message.channel.send(giveawayEM);
      msg.react(":tada:");
    }
}
