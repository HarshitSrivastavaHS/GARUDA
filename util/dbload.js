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
        for (let x in allDocuments) {
            let ong = bot.giveaways.get(allDocuments[x].guild)!=undefined?bot.giveaways.get(allDocuments[x].guild):[];
ong[ong.length] = [allDocuments[x]._id, allDocuments[x].guild, allDocuments[x].chID, allDocuments[x].prize]
          bot.giveaways.set(allDocuments[x].guild, ong)
            give(
                bot,
                Discord,
                allDocuments[x]._id,
                allDocuments[x].endTime,
                allDocuments[x].winners,
                allDocuments[x].prize,
                allDocuments[x].chID,
                allDocuments[x].host,
                allDocuments[x].reqs,
                false,
                allDocuments[x].guild
            );
        }
    }

	

}


  
