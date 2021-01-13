const randomPuppy = require("random-puppy");
module.exports = {
    name: 'afk',
    usage: '&{prefix}afk',
    description: 'adds/removes [AFK] in your nickname.',
    async execute(message, args, bot, Discord, prefix) {
      const srole = message.member.roles.highest.position;
      const brole = message.guild.me.roles.highest.position;
      if (srole>=brole || !message.guild.me.permissions.has("MANAGE_NICKNAMES")) {
      return message.channel.send("I do not have the required permissions.")
      }
      let nick = message.member.nickname;
      if (nick==null) {
        nick = message.author.username;
      }
      if (nick.startsWith("[AFK]")){
        nick = nick.replace(/\[AFK\]/,"");
        message.member.setNickname(nick);
        return;
      }
      else {
        nick = `[AFK] ${nick}`;
        if (nick.length>32)
          nick = nick.substr(0,32);
        message.member.setNickname(nick);
      }
    }
}