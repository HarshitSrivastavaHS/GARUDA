const giveaway = require('../../functions/giveaway.js');
const mongo = require("../../mongo.js")
const giveawaySchema = require("../../Schemas/giveaway-schema.js")
module.exports = {
    name: 'gend',
    usage: `To end any giveaway: &{prefix}gend <message id/link>\nTo reroll the giveaway started by you: &{prefix}gend\nSecond one will not work if more than 50 messages were sent in that channel after your giveaway has ended`,
    description: 'rerolls an already ended giveaway.',
    aliases: ["giveaway-end", "giveawayend"],
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
        let result;
        await mongo().then(async (mongoose)=>{
            result = await giveawaySchema.findOne({
              _id: msg
            })
        })
        if (!result)
            return message.reply("That is not a valid giveaway message id");
        msg = await message.channel.messages.fetch(msg);
        if (!msg) return message.reply("The mentioned giveaway message was not found.")
        message.channel.send("Ending the giveaway in less than 15 seconds");

        giveaway(bot, msg.id, result.reqs, result.bypass, result.blacklist, Date.now()+15000, msg.channel.id, result.winners, result.host, true)
    }
}
