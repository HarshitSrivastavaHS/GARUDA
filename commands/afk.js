const randomPuppy = require("random-puppy");
module.exports = {
    name: 'afk',
    usage: '&{prefix}afk',
    description: 'adds/removes [AFK] in your nickname.',
    permissions: ['SEND_MESSAGES', 'MANAGE_NICKNAMES'],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
      const srole = message.member.roles.highest.position;
      const brole = message.guild.me.roles.highest.position;
      if (srole>=brole) {
      return message.channel.send("Your role is at a higher postition than mine.")
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
