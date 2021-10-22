function Gend(msg, bot) {
  let ong = bot.giveaways.get(msg.guild.id)!=undefined?bot.giveaways.get(msg.guild.id):[];       if (ong.length==1)        {bot.giveaways.delete(msg.guild.id);}       else {       let presentInArray = ong.find(a=>a.includes(msg.id));       if (presentInArray) {         ong.splice(ong.indexOf(presentInArray), 1);                if (ong.length == 0) bot.giveaways.delete(msg.guild.id);         else bot.giveaways.set(msg.guild.id, ong);       }       }
}


module.exports = async (bot, Discord, msg, time, winners, prize, ch, host, reqs, end, guild) => {
  const mongo = require("../mongo.js")
  const giveawaySchema = require("../Schemas/giveaway-schema.js")
  let ms = time-Date.now();
  if (ms<0) {
    ms = 10000;
  }





  let noMes = false;
    const giveawayChannel = await bot.channels.fetch(ch); 
    if (!giveawayChannel) {
        Gend(msg, bot);
      return;
    }
    msgid = msg;   
    msg = await giveawayChannel.messages.fetch(msg).catch(async ()=>{
      await mongo().then(async (mongoose)=>{
        await giveawaySchema.deleteOne({
          _id: msgid
        })
      })

      noMes = true;
    });
    if (noMes) {
        Gend(msg, bot);
      return;
    }
    if (msg.content == "**🎉Giveaway Ended🎉**") {
      await mongo().then(async (mongoose)=>{
        await giveawaySchema.deleteOne({
          _id: msg.id
        })
      })
      Gend(msg, bot);
      return;
    }

    if (reqs) {
      reqs = reqs.split(/ +/);
      for (let R in reqs) {
        reqs[R] = msg.guild.roles.cache.get(reqs[R]);
      }
    }

    if (!end && reqs) {
    const filter = (reaction, user) => reaction.emoji.name === '🎉' && !user.bot;
    const collector = msg.createReactionCollector(filter, { time: ms });
    collector.on('collect', (r, u) => 
    {   
        let member = msg.guild.members.cache.get(u.id);
        
        if (msg.content == "**🎉Giveaway Ended🎉**") return collector.stop();
        let NO = false;
        let norole = [];
        for (let req of reqs) {
            if (!member.roles.cache.has(req.id)){ 
                msg.reactions.resolve('🎉').users.remove(u.id);
                NO = true;
                norole.push(req.name)
            }
        }
        if (NO) {
        let noJoin = new Discord.MessageEmbed()
                      .setColor("RED")
                      .setTitle("You cannot join this giveaway.")
                      .setDescription(`You do not have the \`${norole.join(", ")}\` role${norole.length>1?"s":""} which ${norole.length>1?"are":"is"} required for [this](https://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id})  giveaway.`);
                  member.send({embeds:[noJoin]});
        }
    });
    }






  setTimeout(async ()=>{

    if (msg.content == "**🎉Giveaway Ended🎉**") {
      await mongo().then(async (mongoose)=>{
        await giveawaySchema.deleteOne({
          _id: msg.id
        })
      })
      Gend(msg, bot);
      return;
    }

    Gend(msg, bot);
         
    let giveawayHost = await giveawayChannel.guild.members.fetch(host);
    
    let hostDM = new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle("Your giveaway has ended!")
    .setFooter(`${giveawayChannel.guild.name} - #${giveawayChannel.name}`);
    
    await msg.reactions.cache.get("🎉").users.fetch()
    let giveawayWinners = msg.reactions.cache.get("🎉").users.cache.filter((b)=>{
      if (b.bot) return false;
      if (!reqs) return true;
      let pass = true;
      let member = msg.guild.members.cache.get(b.id);
      for (let req of reqs) {
        if (!member.roles.cache.has(req.id)){ 
            pass = false;
            break;
        }
      }
      return pass;
    }).random(winners);

    giveawayWinners = giveawayWinners.filter(function( element ) {
      return element != undefined;
    });
    
    if (giveawayWinners.length<1) {
      let nowin = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(prize)
      .setDescription(`» Could not determine winner(s).\n» Hosted by: ${giveawayHost}`)
      .setFooter(`Winners: ${winners} | Ended at`)
      .setTimestamp();
      if (reqs)
      nowin.addField("Requirement", reqs.join(", "))

      msg.edit({content:"**🎉Giveaway Ended🎉**", embeds:[nowin]});
      await mongo().then(async (mongoose)=>{
        await giveawaySchema.deleteOne({
          _id: msg.id
        })
      })
      giveawayChannel.send(`Could not determine a winner.\nhttps://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}`);
      hostDM.setDescription(`Your giveaway for [${prize}](https://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}) in ${giveawayChannel.guild.name} has ended.\nCould not determine ${winners>1?"":"a "}winner${winners>1?"s":""}.`)
      return giveawayHost.send({embeds:[hostDM]});
    }
    let winem = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(prize)
    .setDescription (`» ${winners>1?"Winners:":"Winner"}\n${winners>1?giveawayWinners.join("\n"):giveawayWinners}\n» Hosted by: ${giveawayHost}`)
    .setFooter(`Winners: ${winners} | Ended at`)
    .setTimestamp()
    if (reqs)
    winem.addField("Requirement", reqs.join(", "))

    msg.edit({content:"**🎉Giveaway Ended🎉**", embeds:[winem]});
    let winDM = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("You've Won a giveaway!")
    .setDescription(`Congratulations! You have won the giveaway for [${prize}](https://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}) in ${giveawayChannel.guild.name}`)
    .setFooter(`${giveawayChannel.guild.name} - #${giveawayChannel.name}`);
    giveawayWinners.forEach((item,index)=>{
      item.send({embeds:[winDM]});
    })
    giveawayChannel.send(`Congratulations ${winners>1?giveawayWinners.join(", "):giveawayWinners}! You ${winners>1?"all ":""}have won the **${prize}** giveaway!\nhttps://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}`)
    let giveawayWinnersTag = "";
    giveawayWinners.forEach((item,index)=>{
      if (index == 0)
      giveawayWinnersTag += item.tag;
      else 
      giveawayWinnersTag += "\n"+item.tag;
    })
    hostDM.setDescription(`Your giveaway for [${prize}](https://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}) in ${giveawayChannel.guild.name} has ended.\n${winners>1?"Winners are:":"Winner is:"}\n${giveawayWinnersTag}`)
    giveawayHost.send({embeds:[hostDM]});
    await mongo().then(async (mongoose)=>{
      await giveawaySchema.deleteOne({
        _id: msg.id
      })
    })
  }, ms)
}
