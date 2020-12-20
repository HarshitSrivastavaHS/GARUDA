module.exports = {
    name: 'giveaway',
    type: 'utility',
    description: 'to start a giveaway',
    execute: async (message, args, bot, Discord) => {
      if (!args[0]) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      
      if (!args[0].endsWith("d")&&!args[0].endsWith("h")&&!args[0].endsWith("m")&&!args[0].endsWith("s")) return message.channel.send("Invalid Syntax!\nFormat for time: 1d = 1 day, 1h = 1 hour, 1m = 1 minute, 1s = 1 second\nExample:```%giveaway 1d Prize```");
      let time = args[0].substr(args[0].length-1);
      let timee = args[0].substr(0, args[0].length-1)
      if (isNaN(timee)) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d Prize```");
      let prize = args.slice(1).join(" ");
      if (!prize) return message.channel.send("No prize specified. Please specify after the time.");
      message.delete();
      let ms = 0;
      let sym = "";
      if (time=="d") {
         ms = timee*86400*1000;
         sym="day(s)";
      }
      else if (time=="h") {
         ms = timee*3600*1000; 
         sym="hour(s)";
      }
      else if (time=="m") {
         ms = timee*60*1000; 
         sym="minute(s)";
      }
      else if (time=="s") {
         ms = timee*1000; 
         sym="second(s)";
      }
      let giveawayEM = new Discord.MessageEmbed()
      .setTitle(prize)
      .setColor("PURPLE")
      .setFooter("Ends at")
      .setDescription(`React with :tada: to enter!\nTime: ${timee} ${sym}\nHosted by ${message.author.tag}`)
      .setTimestamp(Date.now() + ms);
      let msg = await message.channel.send("**🎉Giveaway🎉**",giveawayEM);
      msg.react("🎉");
      setTimeout(()=>{
          if (msg.reactions.cache.get("🎉").count <= 1) {
             let nowin = new Discord.MessageEmbed()
             .setColor("RED")
             .setTitle(prize)
             .setDescription("No Winner")
             .setFooter(`Ended at`)
             .setTimestamp();
             msg.edit("**🎉Giveaway Ended🎉**", nowin);
             return message.channel.send("No one participated in the giveaway.");
          }
          let winner = msg.reactions.cache.get("🎉").users.cache.filter((b)=>!b.bot).random();
          let winem = new Discord.MessageEmbed()
          .setColor("GREEN")
          .setTitle(prize)
          .setDescription (`Winner\n${winner}`)
          .setFooter("Ended at")
          .setTimestamp()
          msg.edit("**🎉Giveaway Ended🎉**", winem);
          message.channel.send(`Congratulations ${winner}! You won the ${prize}.`)
      }, ms)
    }
}
