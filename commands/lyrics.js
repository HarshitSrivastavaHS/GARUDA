const fetch = require('node-fetch');
const { Util, MessageEmbed } = require ('discord.js');
module.exports = {
    name: 'lyrics', 
    type: 'utility',
    usage: '&{prefix}lyrics <Song name>', 
    aliases: [],
    description:'Retrieves the lyrics of the given song name',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
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
    if (args.length<1) return message.channel.send("**Please enter the name of the song.**")
    message.channel.startTyping();
    const song = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(args.join(" "))}`).then(r=> r.json());
    if (!song ||!song.lyrics){
      message.channel.stopTyping();
      return message.channel.send("**Sorry, couldn't find anything**")
    }
    let embed = new MessageEmbed()
    .setColor("#FFC0CB")
    .setAuthor(song.author)
    .setThumbnail(song.thumbnail ? song.thumbnail.genius : null)
    .setTitle(song.title || 'Unknown')
    .setURL();
    const result = split(song.lyrics);
    if(Array.isArray(result)) {
      if (result.length > 1) {
        embed.setDescription(result[0])
        .addField('\u200b', result[1].substring(0,1024))
        .setDescription(result[0]);
      }
      else {
        embed.setDescription(result[0])
      }
    }
    message.channel.stopTyping();
    return message.channel.send(embed);
    function split(content) {
      return Util.splitMessage(content, {
        maxLength : 2048
      });
    }
  }
}
