const giveaway = require('../functions/giveaway.js');
const mongo = require("../mongo.js")
const giveawaySchema = require("../Schemas/giveaway-schema.js")
module.exports = {
    name: 'giveaway',
    type: 'utility',
    aliases: ["gstart"],
    usage: '&{prefix}giveaway <time> <winners> <prize>\n&{prefix}giveaway <time> <winners> <prize> --r @role\n&{prefix}giveaway <time> <winners> <prize> --r @role1 --r @role2',
    description: 'to start a giveaway.\nFlags:\n\`--r\` to add role requirement. To add multiple role requirements, use \`--r\` multiple times. Role ID or mention can be used for role requirement.\nNOTE: USE FLAGS AT THE END ONLY.',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
    async execute(message, args, bot, Discord, prefix) {
     if (!args[0]||!args[1]||!args[2]) return message.channel.send(`Missing one of the arguements, time/winner/prize. Try \`${prefix}help giveaway\` to know the syntax.`)
      let time = args[0];
      let winners = args[1];
      let rem = args.slice(2).join(" ").split("--");
      let prize = rem[0];
      let flags = rem.slice(1);
      
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
      

      let req = undefined;
      if (flags) {
          for (let flag of flags) {
              let val = flag.split(/ +/).slice(1).join(" ").trim();
              flag = flag[0];
                switch (flag){
                    case "r": 
                        if (!val) return message.channel.send(`Please specify the role after \`--${flag}\``);
                        if (!req) 
                            req = [val];
                        else
                            req.push(val);
                        break;
                    default: return message.channel.send("Invalid flag");
                }
        }
      }
      for (let r in req) {
            req[r] = req[r].replace("<@&", "");
            req[r] = req[r].replace(">", "");
            let role = message.guild.roles.cache.get(req[r]);
            if (!role) return message.channel.send("Role not found");
            req[r] = role;
      }

      const tme = Date.now()+ms;
      let giveawayEM = new Discord.MessageEmbed()
      .setTitle(prize)
      .setColor("PURPLE")
      .setFooter(`Winners: ${winners} | Ends at`)
      .setDescription(`» React with :tada: to enter!\n» Time: **${time}** ${sym} (Ends <t:${tme/1000}:R>)\n» Hosted by ${message.author}`)
      .setTimestamp(tme);
      if (req)
        giveawayEM.addField("Requirement", req.join(", "))

      let msg = await message.channel.send("**🎉Giveaway🎉**",giveawayEM);
      msg.react("🎉");
      
      if (req) {

      for (let i in req) {
        req[i] = req[i].id
      }
      req = req.join(" ");
      }
      await mongo().then(async (mongoose)=>{
          await giveawaySchema.findOneAndUpdate({
            _id: msg.id
          },{
            _id: msg.id,
            prize: prize,
            endTime: tme,
            winners: winners,
            chID: message.channel.id,
            host: message.author.id,
            reqs: req
          },{
            upsert: true
          })
        
      })
        if (message.deletable) message.delete();
        giveaway(bot, Discord, msg.id, tme, winners, prize, message.channel.id, message.author.id, req, false);
    }
      
}
