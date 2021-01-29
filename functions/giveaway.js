
module.exports = async (bot, Discord, msg, time, prize, ch) => {
  const mongo = require("../mongo.js")
  const giveawaySchema = require("../Schemas/giveaway-schema.js")
  let ms = time-Date.now();
  if (ms<0) {
    ms = 10;
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
    if (msg.reactions.cache.get("🎉").count <= 1) {
        let nowin = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(prize)
        .setDescription("No Winner")
        .setFooter(`Ended at`)
        .setTimestamp();
        msg.edit("**🎉Giveaway Ended🎉**", nowin);
        return giveawayChannel.send("No one participated in the giveaway.");
    }
    await msg.reactions.cache.get("🎉").users.fetch()
    let winner = msg.reactions.cache.get("🎉").users.cache.filter((b)=>!b.bot).random();
    let winem = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(prize)
    .setDescription (`Winner\n${winner}`)
    .setFooter("Ended at")
    .setTimestamp()
    msg.edit("**🎉Giveaway Ended🎉**", winem);
    giveawayChannel.send(`Congratulations ${winner}! You won the **${prize}**.`)
   }, ms)
}