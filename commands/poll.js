module.exports = {
    name: 'poll',
    description: 'starts a simple yes/no poll',
    execute: async (message, args, bot, Discord) => {
       if (!args[0]) return message.channel.send("Invalid Syntax.\n```\n%poll <The yes/no question>\n```");
       let question = args.join(" ");
       let pollembed = new Discord.MessageEmbed()
       .setColor("RANDOM")
       .setTitle(`**${question}**`)
       .setDescription("React for yes (👍) or no (👎).")
       .setFooter(`Poll by ${message.author.tag}`)
       .setTimestamp();
       message.channel.send(pollembed).then((msg)=>{
          msg.react("👍").then(()=>{msg.react("👎")})
       })
    }
}
