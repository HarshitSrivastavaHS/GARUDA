const mongo = require(`../mongo`);
const suggestionSchema = require(`../Schemas/suggestion-schema`);

module.exports = {
    name: 'suggest',
    description: 'send suggestions in the suggestion channel.',
    usage: '&{prefix}suggest <suggestion>',
    async execute(message, args, bot, Discord, prefix) {
        if (args<1) return message.channel.send(`Please type the suggestion also.`)
        let mes = await message.channel.send("Searching for the Suggestion Channel.");
        let suggestionchannel = bot.suggestionChannel.get(message.guild.id);
        if (!suggestionchannel) return mes.edit(`No suggestion channel set. If you are an administrator, please do \`${prefix}help setsuggestion\` to know how to set a suggestion channel.`)
      
        let channel = message.guild.channels.cache.get(suggestionchannel);
        const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setTitle("Suggestion")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(args.join(" "))
        .setFooter("Suggested at")
        .addFields(
            {name: "Status", value: `:bar_chart: Waiting for community feedback.`}
          )
        .setTimestamp();
        channel.send(embed).then((msg)=>{
          msg.react("👍").then(()=>{
            msg.react("👎");
          })
        })
        mes.edit(`Suggestion posted in <#${suggestionchannel}>`).then((msg)=>{
          setTimeout(()=>{
            msg.delete()
            message.delete()
          },3000)
        })
    }
}