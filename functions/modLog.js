 module.exports = async (bot, Discord, message, ml, colour, string) => {
  let modChannel = message.guild.channels.cache.get(ml)|| message.guild.fetch(ml);
  if (!modChannel) return;
  let ModEmbed = new Discord.MessageEmbed()
  .setColor(colour)
  .setTimestamp()
  .setTitle(string);
  switch (string) {
      case "MESSAGE DELETED":
          
          break;
  }
  modChannel.send(ModEmbed)
}
