module.exports = {
	name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    let bot = oldMember.client;
		if (bot.freezer.has(`${newMember.guild.id}-${newMember.user.id}`)) {
      if (newMember.nickname != bot.freezer.get(`${newMember.guild.id}-${newMember.user.id}`))
      newMember.setNickname(bot.freezer.get(`${newMember.guild.id}-${newMember.user.id}`)).catch((err)=>{
        return console.log(err);
      });
    }
  },
};