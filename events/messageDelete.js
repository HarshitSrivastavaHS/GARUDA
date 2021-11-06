module.exports = {
	name: 'messageDelete',
  async execute(message) {
    let bot = message.client;
		if (message.author.bot) return;
	  bot.snipes.set(message.channel.id, {
		content: message.content,
		author: message.author.tag,
		avatar: message.author.displayAvatarURL(),
		image: message.attachments.first()
			? message.attachments.first().proxyURL
			: null,
                time: Date.now()
	  });
  },
};