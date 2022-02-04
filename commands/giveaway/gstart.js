const giveaway = require('../../functions/giveaway.js');
const mongo = require("../../mongo.js")
const giveawaySchema = require("../../Schemas/giveaway-schema.js")
const ms = require("ms");
module.exports = {
    name: 'gstart',
    aliases: ["giveaway-start", "giveaway"],
    usage: '&{prefix}giveaway <time> <winners> <prize>\n&{prefix}giveaway [channel] <time> <winners> <prize> [flags]\n&{prefix}giveaway <time> <winners> <prize> --r @role1 ;;; @role2',
    description: 'to start a giveaway.\nFlags:\n\`--req||--r\` to add role requirement. Separate by ;;; for multiple roles. Role ID or mention can be used.\n\`--bypass||--by\` To add bypass roles, separate by ;;; for multiple bypass roles.\n\`--blacklist||--bl\` To prevent people with such role from entering in the giveaway. Separate by ;;; for multiple bypass roles\n\`--donor||\`--d\` to add giveaway donors. Separate by ;;; for multiple donors\`\n\`--txt||--t\` to add custom giveaway message.\nNOTE: Use flags after the giveaway prize only.',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
    async execute(message, args, bot, Discord, prefix) {
        let managerRoles = bot.serverConfig.get(message.guild.id)&&bot.serverConfig.get(message.guild.id).giveaway?bot.serverConfig.get(message.guild.id).giveaway: [];
        if (!message.member.permissions.has("MANAGE_GUILD")&&message.member.roles.cache.filter(r=>managerRoles.includes(r)).size==0) return message.reply("You don't have Manage Server permission and you don't have any of the giveaway manager role either.")
        let channel = `${message.mentions.channels.first()}`==args[0]?message.mentions.channels.first():message.channel;        
        let time = args[`${channel}` == args[0]?1:0];
        let winners = args[`${channel}` == args[0]?2:1];
        let prize = args.slice(`${channel}` == args[0]?3:2).join(" ").split("--")[0];
        if (!time) return message.reply("No time specified.");
        if (!winners) return message.reply("Number of winners not specified");
        if (!prize) return message.reply("Giveaway prize not specified");
        time = ms(time)
        if (time < ms("10s") || time > ms("28days")) return message.channel.send("Time cannot be less than 10 seconds or more than 28 days");
        winners = parseInt(winners);
        if (winners=="NaN") return message.reply("Nummber of winners require a number, ex: 2");
        if (winners > 25 || winners < 1) return message.reply("The giveaway cannot have more than 25 winners or less than 1 winner");
        let endTime = Date.now()+time;
        let giveawayEmbed = new Discord.MessageEmbed()
            .setTitle(prize)
            .setColor("PURPLE")
            .setDescription(`» React with :tada: to enter!\n» Time: **${ms(time)}** (Ends <t:${Math.ceil(endTime/1000)}:R>)\n» Hosted by ${message.author}`)
            .setFooter(`Winners: ${winners} | Ends at`)
            .setTimestamp(endTime);
        let advanceFeature = args.join(" ").split("--");
        advanceFeature.splice(0,1);
        let req = undefined, bypass = undefined, blacklist = undefined, donor = undefined, customTxt = undefined;
        if (advanceFeature) {
            for (let feature of advanceFeature) {
                feature = feature.trim();
                let flag = feature.split(" ")[0].toLowerCase();
                let conditions = feature.substring(flag.length, feature.length);
                conditions = conditions.split(";;;");
                for (let condition of conditions) {
                    condition = condition.trim();
                    if (flag == "req"||flag == "r") {
                        condition = condition.substring(condition.indexOf("&")+1, condition.indexOf(">")==-1?condition.length:condition.indexOf(">"))
                        if (!req) 
                            req = [condition];
                        else
                            req.push(condition);
                    }
                    else if (flag == "bypass"||flag == "by") {
                        condition = condition.substring(condition.indexOf("&")+1, condition.indexOf(">")==-1?condition.length:condition.indexOf(">"))
                        if (!bypass) 
                            bypass = [condition];
                        else
                            bypass.push(condition);
                    }
                    else if (flag == "donor"||flag == "d") {
                        condition = condition.substring(condition.indexOf("@")+1==condition.indexOf("!")?condition.indexOf("@")+2:condition.indexOf("@")+1, condition.indexOf(">")==-1?condition.length:condition.indexOf(">"))
                        if (!donor) 
                            donor = [condition];
                        else
                            donor.push(condition);
                    }
                    else if (flag == "txt"||flag == "t") {
                        
                        if (!customTxt) 
                            customTxt = [condition];
                        else
                            customTxt.push(condition);
                    }
                    else if (flag == "blacklist"||flag == "bl") {
                        condition = condition.substring(condition.indexOf("&")+1, condition.indexOf(">")==-1?condition.length:condition.indexOf(">"))
                        if (!blacklist) 
                            blacklist = [condition];
                        else
                            blacklist.push(condition);
                    }
                    else {
                        return message.reply(`Invalid flag: \`${flag}\``)
                    }
                }
            }
            if (req){
                req = [...new Set(req)]
                let text = [];
                for (let r of req) {
                    let role = await message.guild.roles.fetch(r);
                    if (!role) return message.reply(`Role not found with ID \`${r}\``);
                    text.push(role);
                }
                text = text.join(", ")
                giveawayEmbed.addField(":label: | Required Roles", text)
            }
            if (bypass){
                if (!req) {
                    return message.channel.send("Bypass roles are not required if they isn't any required role");
                }
                bypass = [...new Set(bypass)]
                let text = [];
                for (let r of bypass) {
                    let role = await message.guild.roles.fetch(r);
                    if (!role) return message.reply(`Role not found with ID \`${r}\``);
                    text.push(role);
                }
                text = text.join(", ")
                giveawayEmbed.addField(":door: | Bypass Roles", text)
            }
            if (blacklist){
                blacklist = [...new Set(blacklist)]
                let text = [];
                for (let r of blacklist) {
                    let role = await message.guild.roles.fetch(r);
                    if (!role) return message.reply(`Role not found with ID \`${r}\``);
                    text.push(role);
                }
                text = text.join(", ")
                giveawayEmbed.addField(":no_entry_sign: | Blacklist Roles", text)
            }
            if (donor){
                donor = [...new Set(donor)]
                let text = [];
                for (let m of donor) {
                    let member = await message.guild.members.fetch(m);
                    if (!member) return message.reply(`Donor not found with ID \`${m}\``);
                    text.push(member);
                }
                text = text.join(", ")
                giveawayEmbed.addField(":man_technologist: | Donor", text)
            }

            if (customTxt){
                let text = customTxt.join(";;;")
                giveawayEmbed.addField(":page_with_curl: | Message", text)
            }

            if (req&&blacklist||bypass&&blacklist) {
                if (req)
                    for (let r of req) {
                        if (blacklist.includes(r))
                            return message.reply("Cannot have a role as both requirement and blacklist");
                    }
                else
                    for (let r of bypass) {
                        if (blacklist.includes(r))
                            return message.reply("Cannot have a role as both bypass and blacklist");
                    }
            }
        }
        
        let msg = await channel.send({content: "**:tada:Giveaway:tada:**",embeds:[giveawayEmbed]});
        msg.react("🎉");
        await mongo().then(async (mongoose)=>{
            await giveawaySchema.findOneAndUpdate({
              _id: msg.id
            },{
              _id: msg.id,
              prize: prize,
              endTime: endTime,
              winners: winners,
              chID: channel.id,
              host: message.author.id,
              reqs: req,
              bypass: bypass,
              blacklist: blacklist,
              donor: donor,
              guild: message.guild.id
            },{
              upsert: true
            })
          
        })
        giveaway(bot, msg.id, req, bypass, blacklist, endTime, channel.id, winners, message.author.id);
        let ong = bot.giveaways.get(msg.guild.id)!=undefined?bot.giveaways.get(msg.guild.id):[];
        ong[ong.length] = [msg.id, message.guild.id, channel.id, prize]           
        bot.giveaways.set(msg.guild.id, ong);
        if (channel != message.channel)
            message.channel.send(`Giveaway started in ${channel}`)
        else 
            message.delete().catch((err)=>{})
    }  
}
