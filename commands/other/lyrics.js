const fetch = require('node-fetch');
const { Util, MessageEmbed } = require ('discord.js');
module.exports = {
    name: 'lyrics', 
    
    usage: '&{prefix}lyrics <Song name>', 
    aliases: [],
    description:'Retrieves the lyrics of the given song name',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
    if (args.length<1) return message.channel.send("**Please enter the name of the song.**")
    message.channel.sendTyping();
    const song = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(args.join(" "))}`).then(r=> r.json());
    if (!song ||!song.lyrics){
      
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
    return message.channel.send({embeds:[embed]});
    function split(content) {
      return Util.splitMessage(content, {
        maxLength : 2048
      });
    }
  }
}
