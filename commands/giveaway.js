const giveaway = require('../functions/giveaway.js');
const mongo = require("../mongo.js")
const giveawaySchema = require("../Schemas/giveaway-schema.js")
module.exports = {
    name: 'giveaway',
    type: 'utility',
    usage: '&{prefix}giveaway <time> <winners> <prize>',
    description: 'to start a giveaway',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
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
      if (!args[0]||!args[1]||!args[2]) return message.channel.send(`Missing one of the arguements, time/winner/prize. Try \`${prefix}help giveaway\` to know the syntax.`)
      let time = args[0];
      let winners = args[1];
      let prize = args.slice(2).join(" ");
      
      if (!time.endsWith("d")&&!time.endsWith("h")&&!time.endsWith("m")&&!time.endsWith("s")) return message.channel.send("Please specify the time with a postfix of s/m/h/d for seconds, minutes, hours or days respectively.");
      time = time.substr(0, time.length-1);
      if (isNaN(time)) return message.channel.send("Please specify the time");
      let timeType = args[0][args[0].length-1].toLowerCase();
      if (!winners.endsWith("w")||isNaN(winners.substr(0, winners.length-1))) return message.channel.send("Please specify the number of winners with postfix `w`");
      winners = winners.substr(0, winners.length-1);
      if (winners<1||winners>20) return message.channel.send("Number of winners cannot be less than 1 or more than 20.");
      let ms = 0;
      let sym = "";
      time =  parseInt(time);
      switch(timeType) {
        case 'd': 
            ms = time*86400*1000;
            sym= time>1?"days":"day";
            break;
        case 'h': 
            ms = time*3600*1000;
            sym= time>1?"hours":"hour";
            break;
        case 'm': 
            ms = time*60*1000;
            sym= time>1?"minutes":"minute";
            break;
        case 's': 
            ms = time*1000;
            sym= time>1?"seconds":"second";
            break;
      }
      if (ms<10*1000||ms>86400*1000*28) return message.channel.send("Time cannot be less than 10 seconds or more than 4 weeks.");
      if (message.deletable) message.delete();
      const tme = Date.now()+ms;
      let giveawayEM = new Discord.MessageEmbed()
      .setTitle(prize)
      .setColor("PURPLE")
      .setFooter(`Winners: ${winners} | Ends at`)
      .setDescription(`React with :tada: to enter!\nTime: **${time}** ${sym}\nHosted by ${message.author}`)
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
            winners: winners,
            chID: message.channel.id,
            host: message.author.id
          },{
            upsert: true
          })
        
      })
        
        giveaway(bot, Discord, msg.id, tme, winners, prize, message.channel.id, message.author.id);
    }
      
}
