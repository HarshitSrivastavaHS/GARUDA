module.exports = {
	name: 'guildMemberRemove',
  async execute(member) {
    let bot = member.client;
    let gc = bot.serverConfig.get(member.guild.id)!=undefined?bot.serverConfig.get(member.guild.id).leave:undefined;
    if (!gc) return;
    const byeCH = await bot.channels.fetch(gc).catch((err)=>{console.log("guildMemberRemove.js gc error")});
    if (!byeCH) return;
    byeCH.send(`${member.user.username}#${member.user.discriminator} just left the server.`);
  },
};
