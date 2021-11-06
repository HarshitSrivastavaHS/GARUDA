module.exports = {
	name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    let bot = oldMessage.client;
		if (oldMessage.author.bot) return;
    if (oldMessage.content == newMessage.content) return;
	  bot.editSnipes.set(oldMessage.channel.id, {
		  oldContent: oldMessage.content,
		  newContent: newMessage.content,
		  author: oldMessage.author.tag,
		  avatar: oldMessage.author.displayAvatarURL(),
		  time: newMessage.editedTimestamp
	  });
  },
};