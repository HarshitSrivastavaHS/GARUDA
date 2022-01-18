const giveaway = require('../../functions/giveaway.js');
const mongo = require("../../mongo.js")
const giveawaySchema = require("../../Schemas/giveaway-schema.js")
module.exports = {
    name: 'gstart',
    aliases: [],
    usage: '&{prefix}giveaway <time> <winners> <prize>\n&{prefix}giveaway [channel] <time> <winners> <prize> --r @role\n&{prefix}giveaway <time> <winners> <prize> --r @role1 --r @role2',
    description: 'to start a giveaway.\nFlags:\n\`--r\` to add role requirement. To add multiple role requirements, use \`--r\` multiple times. Role ID or mention can be used for role requirement.\n\`--t\` to add custom text embed. Use this flag only once.\nNOTE: USE FLAGS AT THE END ONLY.',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
    async execute(message, args, bot, Discord, prefix) {
      let managerRoles = bot.serverConfig.get(message.guild.id)&&bot.serverConfig.get(message.guild.id).giveaway?bot.serverConfig.get(message.guild.id).giveaway: [];
     if (!message.member.permissions.has("MANAGE_GUILD")&&message.member.roles.cache.filter(r=>managerRoles.includes(r)).size==0) return message.reply("You don't have Manage Server permission and you don't have any of the giveaway manager role either.")
     if (!args[0]||!args[1]||!args[2]) return message.channel.send(`Missing one of the arguements, time/winner/prize. Try \`${prefix}help giveaway\` to know the syntax.`)
      let channel = message.channel;
      if (args[0]==`${message.mentions.channels.first()}`) { 
        channel = message.mentions.channels.first();
        args.splice(0,1);
        if (channel.guild.id != message.guild.id) return message.reply(`Invalid channel: \`${channel}\``)
        if (!message.member.permissionsIn(channel).toArray().includes("SEND_MESSAGES")||!message.member.permissionsIn(channel).toArray().includes("EMBED_LINKS")) return message.channel.send("You do not have permission to send message/embed links in that channel.")    
        if (!channel.permissionsFor(bot.user).toArray().includes("SEND_MESSAGES")||!channel.permissionsFor(bot.user).toArray().includes("EMBED_LINKS")) return message.channel.send("I do not have permission to send message/embed links in that channel.")    
        
     }
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
      let text = undefined;
      if (flags) {
          for (let flag of flags) {
              let val = flag.split(/ +/).slice(1).join(" ").trim();
              flag = flag[0];
                switch (flag){
                    case "r": 
                        if (!val) return message.reply(`Please specify the role after \`--${flag}\``);
                        if (!req) 
                            req = [val];
                        else
                            req.push(val);
                        break;
                    case "t":
                        if (text) return message.reply("Cannot have multiple text embeds"); 
                        if (!val) return message.reply("Please enter the message.")
                        text = new Discord.MessageEmbed()
                          .setTitle("**Giveaway Message**")
                          .setDescription(val.substr(0,2000))
                          .setColor("PURPLE")
                          .setTimestamp();
                          break;
                    default: return message.reply("Invalid flag");
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
      .setDescription(`» React with :tada: to enter!\n» Time: **${time}** ${sym} (Ends <t:${Math.ceil(tme/1000)}:R>)\n» Hosted by ${message.author}`)
      .setTimestamp(tme);
      if (req)
        giveawayEM.addField("Role Requirements", req.join(", "))

      let msg = await channel.send({content: "**🎉Giveaway🎉**",embeds:[giveawayEM]});
      msg.react("🎉");
      if (text) channel.send({embeds:[text]});
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
            chID: channel.id,
            host: message.author.id,
            reqs: req,
            guild: message.guild.id
          },{
            upsert: true
          })
        
      })
      if (channel.id == message.channel.id) {
        if (message.deletable&&!message.deleted) message.delete();
      } else {
        message.channel.send(`Giveaway Started in ${channel}`);
      }
        
        let ong = bot.giveaways.get(msg.guild.id)!=undefined?bot.giveaways.get(msg.guild.id):[];
      ong[ong.length] = [msg.id, message.guild.id, channel.id, prize]           
        bot.giveaways.set(msg.guild.id, ong);
        giveaway(bot, Discord, msg.id, tme, winners, prize, channel.id, message.author.id, req, undefined, false);
    }
      
}
