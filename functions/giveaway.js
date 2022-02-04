const Discord = require("discord.js")
const mongo = require("../mongo.js");
const giveawaySchema = require("../Schemas/giveaway-schema.js");

async function ENDGIVEAWAY(bot, message, msg, channel){
    if (msg||channel) {
        let guild = msg?msg.guild.id:channel.guild.id;
        let ong = bot.giveaways.get(guild)!=undefined?bot.giveaways.get(guild):[];
        if (ong.length==1) {
            bot.giveaways.delete(guild);
        }
        else {
            let msgId = msg?msg.id:message
            let presentInArray = ong.find(a=>a.includes(msgId));
            if (presentInArray) {
                ong.splice(ong.indexOf(presentInArray), 1);
                if (ong.length == 0) 
                    bot.giveaways.delete(guild);
                else 
                    bot.giveaways.set(guild, ong);
            }       
        }
    }
    
    await mongo().then(async (mongoose)=>{
        await giveawaySchema.deleteOne({
          _id: message
        })
    })
    let giveaway = bot.giveaways2.get(message);
    if (giveaway){
        if (giveaway.timeout) clearTimeout(giveaway.timeout);
        if (giveaway.collector) giveaway.collector.stop();
    }
}

module.exports = (async(bot, giveawayMessage, req, bypass, blacklist, time, giveawayChannel, winners, host, end)=>{
    let ms = time-Date.now();
    if (ms<0) 
        ms = 10000;
    let channel = await bot.channels.fetch(giveawayChannel).catch(()=>{});
    if (!channel) return await ENDGIVEAWAY(bot, giveawayMessage);
    await channel.fetch();
    let message = await channel.messages.fetch(giveawayMessage).catch(()=>{})
    if (!message) return await ENDGIVEAWAY(bot, giveawayMessage, channel);
    if (message.content == "**🎉Giveaway Ended🎉**") return await ENDGIVEAWAY(bot, giveawayMessage, message);

    let collector;
    if ((req||blacklist)&&!end) {
        let reqRole = [];
        let bypassRole = [];
        let blacklistRole = [];
        if (req) {
            for (let R of req) {
                let role = await message.guild.roles.fetch(R);
                if (!role)
                    continue;
                reqRole.push(role);
            }

            if (reqRole.length>0&&bypass) {
                for (let R of bypass) {
                    let role = await message.guild.roles.fetch(R);
                    if (!role)
                        continue;
                    bypassRole.push(await message.guild.roles.fetch(R));
                }
            }
        }
        if (blacklist) {
            for (let R of blacklist) {
                let role = await message.guild.roles.fetch(R);
                if (!role)
                    continue;
                blacklistRole.push(await message.guild.roles.fetch(R));
            }
        }
        
        const filter = (reaction, user) => reaction.emoji.name === '🎉' && !user.bot;
        collector = message.createReactionCollector(filter, { time: ms });
        collector.on('collect', async (r, u) => {   
            if (u.bot) return;
            let member = await message.guild.members.fetch(u.id);
            let NO = false;
            let norole = [];
            for (let role of blacklistRole) {
                if (member.roles.cache.has(role.id)){ 
                    NO = true;
                    norole.push(role.name)
                }
            }
            if (NO) {
                message.reactions.resolve('🎉').users.remove(u.id);
                let noJoin = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle("You cannot join this giveaway.")
                    .setDescription(`You have the \`${norole.join(", ")}\` role${norole.length>1?"s":""} which ${norole.length>1?"are":"is"} blacklisted for [this](https://discord.com/channels/${channel.guild.id}/${channel.id}/${message.id})  giveaway.`);
                member.send({embeds:[noJoin]});
            }
            else {
                let c = 0;
                req:
                for (let role of reqRole) {
                    if (!member.roles.cache.has(role.id)){
                        if (c==0){
                            for (let role of bypassRole) {
                                if (member.roles.cache.has(role.id))
                                    NO = false;
                                    break req; 
                            }
                        } 
                        NO = true;
                        norole.push(role.name)
                        c=1;
                    }
                }
                if (NO) {
                    message.reactions.resolve('🎉').users.remove(u.id);
                    let noJoin = new Discord.MessageEmbed()
                        .setColor("RED")
                        .setTitle("You cannot join this giveaway.")
                        .setDescription(`You do not have the \`${norole.join(", ")}\` role${norole.length>1?"s":""} which ${norole.length>1?"are":"is"} required for [this](https://discord.com/channels/${channel.guild.id}/${channel.id}/${message.id})  giveaway.`);
                    member.send({embeds:[noJoin]});
                }
            }
        });
    }

    let timeout = setTimeout(async ()=>{
        if (!message.editable) return await ENDGIVEAWAY(bot, giveawayMessage, message);
        if (message.content == "**🎉Giveaway Ended🎉**") return await ENDGIVEAWAY(bot, giveawayMessage, message);
        await message.fetch()
        let embed = message.embeds[0];
        let prize = embed.title;
        let lastLine = embed.description.substring(embed.description.lastIndexOf("\n")+1, embed.description.length);
        message.reactions.cache.get("🎉")&& await message.reactions.cache.get("🎉").users.fetch()
        let giveawayWinners = message.reactions.cache.get("🎉")!=null?message.reactions.cache.get("🎉").users.cache.filter(async (u)=>{
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
        }).filter((w)=>w!=undefined&&!w.bot).random(winners):[];
        let hostDM = new Discord.MessageEmbed()
            .setColor("PURPLE")
            .setTitle("Your giveaway has ended!")
            .setFooter(`${channel.guild.name} - #${channel.name}`);

        embed.setTimestamp()
            .setFooter(`Winners: ${winners} | Ended at`);
        let giveawayEndText = "";
        if (giveawayWinners.length<1) {
            embed.setDescription(`» Could not determine winner(s).\n${lastLine}`).setColor("RED");
            giveawayEndText = `Could not determine a winner.`;
            hostDM.setDescription(`Your giveaway for [${prize}](https://discord.com/channels/${channel.guild.id}/${channel.id}/${message.id}) in ${channel.guild.name} has ended.\nCould not determine ${winners>1?"":"a "}winner${winners>1?"s":""}.`);
        }
        else {
            embed.setDescription(`» ${winners>1?"Winners:":"Winner"}\n${winners>1?giveawayWinners.join("\n"):giveawayWinners}\n${lastLine}`).setColor("GREEN");
            giveawayEndText = `Congratulations ${winners>1?giveawayWinners.join(", "):giveawayWinners}! You ${winners>1?"all ":""}have won the **${prize}** giveaway!`;
            hostDM.setDescription(`Your giveaway for [${prize}](https://discord.com/channels/${channel.guild.id}/${channel.id}/${channel.id}) in ${channel.guild.name} has ended.\n${winners>1?"Winners are:":"Winner is:"}\n${giveawayWinners.map(w=>w.tag).join("\n")}`)
            let winDM = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("You've Won a giveaway!")
            .setDescription(`Congratulations! You have won the giveaway for [${prize}](https://discord.com/channels/${channel.guild.id}/${channel.id}/${channel.id}) in ${channel.guild.name}`)
            .setFooter(`${channel.guild.name} - #${channel.name}`);
            giveawayWinners.forEach((winner)=>{
              winner.send({embeds:[winDM]});
            })
        }
        message.reply({content: `${giveawayEndText}`});
        message.edit({content: "**🎉Giveaway Ended🎉**", embeds:[embed]});
        let giveawayHost = await channel.guild.members.fetch(host).catch(()=>{});
        if (giveawayHost) giveawayHost.send({embeds: [hostDM]}).catch(()=>{});
        await ENDGIVEAWAY(bot, giveawayMessage, message)
    }, ms)
    if (!end){
        await bot.giveaways2.set(giveawayMessage, {timeout, collector});
    }
})



