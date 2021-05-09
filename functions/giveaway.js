
module.exports = async (bot, Discord, msg, time, winners, prize, ch, host) => {
  const mongo = require("../mongo.js")
  const giveawaySchema = require("../Schemas/giveaway-schema.js")
  let ms = time-Date.now();
  if (ms<0) {
    ms = 10000;
  }
  setTimeout(async ()=>{
    await mongo().then(async (mongoose)=>{
      await giveawaySchema.deleteOne({
        _id: msg
      })
    })
    const giveawayChannel = await bot.channels.fetch(ch); 
    if (!giveawayChannel) return;   
    msg = await giveawayChannel.messages.fetch(msg);
    if (!msg) return;
    if (msg.reactions.cache.get("🎉").count <= winners) {
        let nowin = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(prize)
        .setDescription(`Could not determine winner(s).\nHosted by: ${giveawayChannel.guild.members.cahce.get(host)}`)
        .setFooter(`Ended at`)
        .setTimestamp();
        msg.edit("**🎉Giveaway Ended🎉**", nowin);
        return giveawayChannel.send(`Could not determine a winner.\nhttps://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}`);
    }
    await msg.reactions.cache.get("🎉").users.fetch()
    let giveawayWinners = msg.reactions.cache.get("🎉").users.cache.filter((b)=>!b.bot).random(winners);
    
    let winem = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(prize)
    .setDescription (`${winners>1?"Winners:":"Winner"}\n${winners>1?giveawayWinners.forEach((item, index)=>{item+"\n"}):giveawayWinners}\nHosted by: ${giveawayChannel.guild.members.cache.get(host)}`)
    .setFooter("Ended at")
    .setTimestamp()
    msg.edit("**🎉Giveaway Ended🎉**", winem);
    let winDM = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("You Won a giveaway!")
    .setDescription(`Congratulations! You have won the giveaway for [${prize}](https://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}) in ${giveawayChannel.guild.name}`)
    .setFooter(`${giveawayChannel.guild.name} - #${giveawayChannel.name}`);
    bot.users.cache.get(winner.id).send(winDM);
    giveawayChannel.send(`Congratulations ${winner}! You have won the **${prize}** giveaway!.\nhttps://discord.com/channels/${giveawayChannel.guild.id}/${giveawayChannel.id}/${msg.id}`)
   }, ms)
}
