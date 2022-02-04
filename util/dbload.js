const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');
const afkConfig = require('../Schemas/afk');
const freezerConfig = require('../Schemas/freezenick');
const giveawaySchema = require('../Schemas/giveaway-schema.js');
const give = require('../functions/giveaway.js');
const serverConfigurator = require('../functions/serverConfig');
const Discord = require("discord.js");
module.exports = async (bot) => {

    //loads per server settings
    bot.serverConfig = new Map();
    const server = (async ()=>{
        const results = await serverConfig.find();
        for (const result of results){
            serverConfigurator(bot, result._id);
        }
    })();

    //loads afk data
    bot.afk = new Map();
    const afkusers = (async ()=>{
	    const results = await afkConfig.find();
        for (const result of results){
            bot.afk.set(result._id, {msg: result.afk, time: result.time});
        }
    })();

    //loads all freezed nick users
    bot.freezer = new Map();
    const freezedusers = (async ()=>{
	    const results = await freezerConfig.find();
        for (const result of results){
            bot.freezer.set(result._id, result.nick);
        }
    })();

    //loads all the giveaways
    bot.giveaways = new Map();
    let allDocuments = [];
	await mongo().then(async mongoose => {
			allDocuments = await giveawaySchema.find({});
	});
	if (allDocuments.length >= 1) {
        for (let x of allDocuments) {
            let ong = bot.giveaways.get(x.guild)!=undefined?bot.giveaways.get(x.guild):[];
ong[ong.length] = [x._id, x.guild, x.chID, x.prize]
          bot.giveaways.set(x.guild, ong)
            give(
                bot,
                x._id,
                x.reqs,
                x.bypass,
                x.blacklist,
                x.endTime,
                x.chID,
                x.winners,
                x.host,
                false,
            );
        }
    }

	

}


  
