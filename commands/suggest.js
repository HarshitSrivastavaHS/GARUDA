module.exports = {
    name: 'suggest',
    description: 'send suggestions in the suggestion channel.',
    usage: '&{prefix}suggest <suggestion>',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
    async execute(message, args, bot, Discord, prefix) {
        if (args<1) return message.channel.send(`Please type the suggestion also.`)
        let mes = await message.channel.send("Searching for the Suggestion Channel.");
        let suggestionchannel = bot.serverConfig.get(message.guild.id)!=undefined?bot.serverConfig.get(message.guild.id).suggestion:undefined;
        if (!suggestionchannel) return mes.edit(`No suggestion channel set. If you are an administrator, please do \`${prefix}help setsuggestion\` to know how to set a suggestion channel.`)
      
        let channel = message.guild.fetch(suggestionchannel);
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
        
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
        channel.send({embeds:[embed]}).then((msg)=>{
          msg.react("👍").then(()=>{
            msg.react("👎");
          })
        })
        mes.edit(`Suggestion posted in <#${suggestionchannel}>`).then((msg)=>{
          setTimeout(()=>{
            msg.delete()
            message.delete().catch();
          },3000)
        })
    }
}
