module.exports = {
    name: 'greroll',
    usage: `To reroll any giveaway: &{prefix}greroll <message id/link>\nTo reroll the giveaway started by you: &{prefix}greroll\nSecond one will not work if more than 50 messages were sent in that channel after your giveaway has ended`,
    description: 'rerolls an already ended giveaway.',
    aliases: ["giveaway-reroll", "giveawayreroll"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let managerRoles = bot.serverConfig.get(message.guild.id)&&bot.serverConfig.get(message.guild.id).giveaway?bot.serverConfig.get(message.guild.id).giveaway: [];
        if (!message.member.permissions.has("MANAGE_GUILD")&&message.member.roles.cache.filter(r=>managerRoles.includes(r)).size==0) return message.reply("You don't have Manage Server permission and you don't have any of the giveaway manager role either.")
     
        
        let msg; 
        if (args[0]){
            msg = args[0].substring(args[0].lastIndexOf("/"));
        }
        else {
            if (message.reference)
                msg = message.reference.messageId; 
        }
        if (!msg) return message.reply("Please reply to the giveaway message or use its link with the command.");
        msg = await message.channel.messages.fetch(msg);
        if (!msg) return message.reply("Message not found.");
        if (!msg.embeds[0]||msg.content!="**🎉Giveaway Ended🎉**") return msg.reply("Either this message is not a giveaway message by me or the giveaway hasn't ended yet.");
        let req, bypass, blacklist;
        let embed = msg.embeds[0];
        if (embed.fields) {
            for (let field of embed.fields) {
                let value = field.value.split(", ");
                for (let i in value) {
                    value[i] = value[i].substring(field.value.indexOf("&")+1, field.value.indexOf(">"))
                }
                switch (field.name) {
                    case ":label: | Required Roles":
                        req = value;
                        break;
                    case ":door: | Bypass Roles":
                        bypass = value;
                        break;
                    case ":no_entry_sign: | Blacklist Roles":
                        blacklist = value;
                        break;
                }
            }
        }
        await msg.fetch()
        msg.reactions.cache.get("🎉")&& await msg.reactions.cache.get("🎉").users.fetch()
        let giveawayWinners = msg.reactions.cache.get("🎉")!=null?msg.reactions.cache.get("🎉").users.cache.filter(async (u)=>{
            if (u.bot) return false;
            if (blacklist) {
                let member = await message.guild.members.fetch(u.id);
                for (let b of blacklist) {
                    if (member.roles.cache.has(b))
                        return false;
                }
            }
            if (!req) return true;
            let pass = true;
            let member = await message.guild.members.fetch(u.id);
            req: for (let r of req) {
                if (!member.roles.cache.has(r)){
                    if (bypass) {
                        for (let b of bypass) {
                            if (member.roles.cache.has(b))
                                break req;
                        }
                    } 
                    pass = false;
                    break;
                }
            }
            return pass;
        }).filter((w)=>w!=undefined&&!w.bot).random(1):[];
        console.log(giveawayWinners)
        if (giveawayWinners.length==1) {
            msg.reply(`${giveawayWinners[0]} has won the reroll of **${msg.embeds[0].title}**`);
        }
        else {
            msg.reply("Not enough reactions to find a winner.");
        }
    }
}
