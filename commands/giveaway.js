const giveaway = require('../functions/giveaway.js');
const mongo = require("../mongo.js")
const giveawaySchema = require("../Schemas/giveaway-schema.js")
module.exports = {
    name: 'giveaway',
    type: 'utility',
    usage: '&{prefix}giveaway <time> <winners> <prize>',
    description: 'to start a giveaway',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
      
        if (!args[0]) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d 1w Prize```");
      args[0] = args[0].toLowerCase();
      if (!args[0].endsWith("d")&&!args[0].endsWith("h")&&!args[0].endsWith("m")&&!args[0].endsWith("s")) return message.channel.send("Invalid Syntax!\nFormat for time: 1d = 1 day, 1h = 1 hour, 1m = 1 minute, 1s = 1 second\nExample:```%giveaway 1d 1w Prize```");
      let time = args[0].substr(args[0].length-1);
      let timee = args[0].substr(0, args[0].length-1)
      if (isNaN(timee)) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d 1w Prize```");
      if (!args[0]||!args[1].toLowerCase().endsWith("w")) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d 1w Prize```");
      let winners = args[1].substr(0, args[1].length-1)
      if (isNaN(winners)) return message.channel.send("Invalid Syntax!\nExample:```%giveaway 1d 1w Prize```");
      let prize = args.slice(2).join(" ");
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
      const tme = Date.now()+ms;
      let giveawayEM = new Discord.MessageEmbed()
      .setTitle(prize)
      .setColor("PURPLE")
      .setFooter("Ends at")
      .setDescription(`React with :tada: to enter!\nTime: ${timee} ${sym}\nHosted by ${message.author.tag}`)
      .setTimestamp(tme);
      let msg = await message.channel.send("**🎉Giveaway🎉**",giveawayEM);
      msg.react("🎉");
      await mongo().then(async (mongoose)=>{
          await giveawaySchema.findOneAndUpdate({
            _id: msg.id
          },{
            _id: msg.id,
            prize: prize,
            endTime: tme,
            chID: message.channel.id
          },{
            upsert: true
          })
        
      })
        giveaway(bot, Discord, msg.id, tme, prize, message.channel.id);
    }
      
}
