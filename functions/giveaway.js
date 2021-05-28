
module.exports = async (bot, Discord, msg, time, winners, prize, ch, host, reqs, end) => {
  const mongo = require("../mongo.js")
  const giveawaySchema = require("../Schemas/giveaway-schema.js")
  let ms = time-Date.now();
  if (ms<0) {
    ms = 10000;
  }





  let noMes = false;
    const giveawayChannel = await bot.channels.fetch(ch); 
    if (!giveawayChannel) return;
    msgid = msg;   
    msg = await giveawayChannel.messages.fetch(msg).catch(async ()=>{
      await mongo().then(async (mongoose)=>{
        await giveawaySchema.deleteOne({
          _id: msgid
        })
      })
      noMes = true;
    });
    if (noMes) return;
    if (msg.content == "**🎉Giveaway Ended🎉**") {
      await mongo().then(async (mongoose)=>{
        await giveawaySchema.deleteOne({
          _id: msg.id
        })
      })
      return;
    }
    if (!end && reqs) {
    reqs = reqs.split(/ +/);
    const filter = (reaction, user) => reaction.emoji.name === '🎉' && !user.bot;
    const collector = msg.createReactionCollector(filter, { time: ms });
    collector.on('collect', (r, u) => 
    {   
        let member = msg.guild.members.cache.get(u.id);
        
        if (msg.content == "**🎉Giveaway Ended🎉**") collector.stop();
        
        for (let req of reqs) {
          let req = msg.guild.roles.cache.get(req);
            if (!member.roles.cache.has(req.id)){ 
                msg.reactions.resolve('🎉').users.remove(u.id);
                let noJoin = new Discord.MessageEmbed()
                      .setColor("RED")
                      .setTitle("You cannot join this giveaway.")
                      .setDescription(`You do not have the \`${req.name}\` role which is required for [this](https://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id})  giveaway.`);
                  member.send(noJoin);
            }
        }
    });
    }






  setTimeout(async ()=>{
   
    let giveawayHost = giveawayChannel.guild.members.cache.get(host);
    
    let hostDM = new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle("Your giveaway has ended!")
    .setFooter(`${giveawayChannel.guild.name} - #${giveawayChannel.name}`);
    
    if (msg.reactions.cache.get("🎉").count <= winners) {
        let nowin = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(prize)
        .setDescription(`Could not determine winner(s).\nHosted by: ${giveawayHost}`)
        .setFooter(`Winners: ${winners} | Ended at`)
        .setTimestamp();
        if (reqs)
        nowin.addField("Requirement", reqs.join(", "))

        msg.edit("**🎉Giveaway Ended🎉**", nowin);
        await mongo().then(async (mongoose)=>{
          await giveawaySchema.deleteOne({
            _id: msg.id
          })
        })
        giveawayChannel.send(`Could not determine a winner.\nhttps://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}`);
        hostDM.setDescription(`Your giveaway for [${prize}](https://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}) in ${giveawayChannel.guild.name} has ended.\nCould not determine ${winners>1?"":"a "}winner${winners>1?"s":""}.`)
        return giveawayHost.send(hostDM);
    }
    await msg.reactions.cache.get("🎉").users.fetch()
    let giveawayWinners = msg.reactions.cache.get("🎉").users.cache.filter((b)=>!b.bot).random(winners);
    
    let winem = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(prize)
    .setDescription (`${winners>1?"Winners:":"Winner"}\n${winners>1?giveawayWinners.join("\n"):giveawayWinners}\nHosted by: ${giveawayHost}`)
    .setFooter(`Winners: ${winners} | Ended at`)
    .setTimestamp()
    if (reqs)
    winem.addField("Requirement", reqs.join(", "))

    msg.edit("**🎉Giveaway Ended🎉**", winem);
    let winDM = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("You've Won a giveaway!")
    .setDescription(`Congratulations! You have won the giveaway for [${prize}](https://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}) in ${giveawayChannel.guild.name}`)
    .setFooter(`${giveawayChannel.guild.name} - #${giveawayChannel.name}`);
    giveawayWinners.forEach((item,index)=>{
      item.send(winDM);
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
    giveawayHost.send(hostDM);
    await mongo().then(async (mongoose)=>{
      await giveawaySchema.deleteOne({
        _id: msg.id
      })
    })
  }, ms)
}
