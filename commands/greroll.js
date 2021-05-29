module.exports = {
    name: 'greroll',
    type: 'utility',
    usage: `To reroll any giveaway: &{prefix}greroll <message id/link>\nTo reroll the giveaway started by you: &{prefix}greroll\nSecond one will not work if more than 50 messages were sent in that channel after your giveaway has ended`,
    description: 'rerolls an already ended giveaway.',
    aliases: ["giveaway-reroll", "giveawayreroll"],
    permissions: ['SEND_MESSAGES'],
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
        
        let msg;
            if (args.length>0) {
                try {
                    if (args[0].startsWith("https://discord.com/channels/"))
                        args[0] = args[0].substr(args[0].lastIndexOf("/")+1,args[0].length)
                    
                    msg = await message.channel.messages.fetch(args[0]);
                    if (msg.author.id!="777840690515279872"||!msg.embeds.length>0||msg.content!="**🎉Giveaway Ended🎉**")
                        throw new Error(':/');
                }
                catch {
                    return message.channel.send("Provided message is not a valid ended giveaway message id.")
                }
            }
            else {
                let msgs = await message.channel.messages.fetch(50);
                msgs = msgs.filter(m=>m.author.id=="777840690515279872"&&m.embeds.length>0&&m.content=="**🎉Giveaway Ended🎉**"&&m.embeds[0].description.substr(m.embeds[0].description.lastIndexOf(":")+2,m.embeds[0].description.length).includes(message.author.id));
                if (msgs.size<1) return message.channel.send("Could not find a giveaway started by you.")
                msgs = msgs.sort(function(a, b) {
                    return parseFloat(b.createdTimestamp) - parseFloat(a.createdTimestamp);
                });
                let msgid; 
                msgs.map(i=>{
                    if (!msgid){
                        msgid = i.id;
                    }
                })
                msg = msgs.get(msgid);
            }

            let rrole = msg.embeds[0].fields.length>0?msg.embeds[0].fields[0].value.split(", ")[0]:undefined;
            if (rrole) {
                for (r in rrole) { 
                    rrole[r] = rrole[r].replace("<@&", "")
                    rrole[r] = rrole[r].replace(">", "")
                    rrole[r] = msg.guild.roles.cache.get(rrole[r]);
                }
            }
            await msg.reactions.cache.get("🎉").users.fetch()
            let winner = msg.reactions.cache.get("🎉").users.cache.filter((b)=>{
                if (b.bot) return false;
                if (!rrole) return true;
                let pass = true;
                let member = msg.guild.members.cache.get(b.id);
                console.log(".")
                for (let req of rrole) {
                    console.log(req);
                    console.log(req.id)
                    console.log(member.roles.cache.has(req.id))
                  if (!member.roles.cache.has(req.id)){ 
                      pass = false;
                      break;
                  }
                }
                return pass;
              }).random();
            if (winner) {
                
                message.channel.send(`Congratulations ${winner}! You have won the reroll for **${msg.embeds[0].title}!**\nhttps://discord.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}`);
                
                let winDM = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("You've Won a giveaway reroll!")
                    .setDescription(`Congratulations! You have won the giveaway reroll for [${msg.embeds[0].title}](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}) in ${message.guild.name}`)
                    .setFooter(`${message.guild.name} - #${message.channel.name}`);
                
                winner.send(winDM)
            }
            else {
                message.channel.send(`Not enough reactions to choose a winner\nhttps://discord.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}`)
            }
        
    }
}
