module.exports = {
    name: 'suggestion',
    description: 'accept/reject a suggestion.',
    usage: '&{prefix}suggestion <suggestion id or reply to the message and exclude this> <accept/reject> <reason>',
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can accept or reject suggestions.");
        const smsgid = message.reference?message.reference["messageID"]:args[0];
        if (!smsgid) return message.reply("Please reply or type the messsage id")
        let sch = bot.suggestionChannel.get(message.guild.id);
        if (!sch) return message.reply("Suggestion channel not set :(");
        const channel = bot.channels.cache.get(sch);
        if (!channel) return message.reply("Suggestion channel not found.");
        let msg;
        try {
          msg = await channel.messages.fetch(smsgid);
        }
        catch {
          return message.channel.send("Message not found.")
        }
        if (!msg.editable) return message.reply("That message cannot be edited by me.");
        if (!msg.embeds) return message.reply("That's not the message id of a suggestion message.")
        if (msg.embeds[0].title!="Suggestion") return message.reply("That suggestion is either already accepted/rejected or its not a suggestion.")

        if (message.reference){
          if (message.reference["messageID"]==args[0])
            args = args.slice(1);
        }
        if (!args.length>0) return message.reply("Kinldy mention whether to accept or reject?")
        if (!(args[0].toLowerCase() == "accept") && !(args[0].toLowerCase() == "reject")) args = args.slice(1);
        if (!args.length>0) return message.reply("Whether to accept or reject?")
        if (!(args[0].toLowerCase() == "accept") && !(args[0].toLowerCase() == "reject")) return message.reply("kindly tell whether to accept or reject the suggestion.")
        let embed = new Discord.MessageEmbed()
        .setDescription(msg.embeds[0].description)
        .setAuthor(msg.embeds[0].author["name"], msg.embeds[0].author["iconURL"])
        .setTimestamp();

        if (args[0].toLowerCase() == "accept") {
          args = args.slice(1);
          embed
          .setTitle("Suggestion Accepted")
          .setColor("GREEN")
          .addFields(
            {name: "Status", value: `:white_check_mark: Accepted ${args.length>0?"| "+args.join(" "):""}`}
          );
        }
        else {
          args = args.slice(1);
          embed
          .setTitle("Suggestion Declined")
          .setColor("RED")
          .addFields(
            {name: "Status", value: `:x: Declined ${args.length>0?"| "+args.join(" "):""}`}
          );
        }
        message.channel.send("Done!").then((ms) =>{
          setTimeout(()=>{message.delete(); ms.delete();}, 2000)
        })
        msg.edit(embed);
    }
}