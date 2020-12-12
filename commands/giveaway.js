module.exports = {
    name: 'giveaway',
    description: 'to start a giveaway',
    execute: async (message, args, bot, Discord) => {
      if (!args[0]) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      
      if (!args[0].endsWith("d")&&!args[0].endsWith("h")&&!args[0].endsWith("m")&&!args[0].endsWith("s")) return message.channel.send("Invalid Syntax!\nFormat for time: 1d = 1 day, 1h = 1 hour, 1m = 1 minute, 1s = 1 second\nExample:```%giveaway 1d Prize```");
      let time = args[args.length-1].toLowerCase;
      let timee = args[0].substr(0, args[0].length-1)
      if (isNaN(timee)) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      let prize = args.slice(1).join(" ");
      if (!prize) return message.channel.send("No prize specified. Please specify after the time.");
      let ms = 0;
      let sym
      if (time=="d") {
         ms = timee*86400*1000;
         sym="day(s)";
      }
      else if (time=="h") {
         ms = time*3600*1000; 
         sym="hour(s)";
      }
      else if (time=="m") {
         ms = time*60*1000; 
         sym="minute(s)";
      }
      else if (time=="s") {
         ms = time*1000; 
         sym="second(s)";
      }
      let giveawayEM = new Discord.MessageEmbed()
      .setTitle(prize)
      .setColor("PURPLE")
      .setFooter("Ends at")
      .setDescription(`React with :tada: to enter!\nTime: ${timee} ${sym}\nHosted by ${message.author.tag}`)
      .setTimestamp(Date.now() + ms);
      message.channel.send(":tada:GIVEAWAY:tada:");
      let msg = await message.channel.send(giveawayEM);
      msg.react("🎉");
    }
}
