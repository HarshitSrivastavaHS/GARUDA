const giveaway = require('../functions/giveaway.js');
const mongo = require("../mongo.js")
const giveawaySchema = require("../Schemas/giveaway-schema.js")
module.exports = {
    name: 'gend',
    type: 'utility',
    usage: `To end any giveaway: &{prefix}gend <message id/link>\nTo reroll the giveaway started by you: &{prefix}gend\nSecond one will not work if more than 50 messages were sent in that channel after your giveaway has ended`,
    description: 'rerolls an already ended giveaway.',
    aliases: ["giveaway-end", "giveawayend"],
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
                if (msg.author.id!="777840690515279872"||!msg.embeds.length>0||msg.content!="**🎉Giveaway🎉**")
                    throw new Error(':/');
            }
            catch {
                return message.channel.send("Provided message is not a valid giveaway message id.")
            }
        }
        else {
            let msgs = await message.channel.messages.fetch(50);
            msgs = msgs.filter(m=>m.author.id=="777840690515279872"&&m.embeds.length>0&&m.content=="**🎉Giveaway🎉**"&&m.embeds[0].description.substr(m.embeds[0].description.lastIndexOf("by")+2,m.embeds[0].description.length).includes(message.author.id));
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
        message.channel.send("Ending the giveaway in less than 15 seconds");
        let result;
        await mongo().then(async (mongoose)=>{
            result = await giveawaySchema.findOne({
              _id: msg.id
            })
        })
        giveaway(bot, Discord, result._id, message.createdTimestamp+10000, result.winners, result.prize, result.chID, result.host);
    }
}
