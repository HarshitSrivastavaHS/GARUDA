const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');

module.exports = (async (bot, guildID)=>{
    let result = await serverConfig.findOne({
        _id: guildID}
                                           );
    bot.serverConfig.set(result._id, {
        prefix: result.prefix?result.prefix: "%",
        suggestion: result.suggestion,
        welcomer: {
            channel: result.welcomer?.channel, 
            message: result.welcomer?.message
        },
        leave: result.leave,
        modLog: result.modLog,
        ghost: result.ghost,
        autoRole: result.autoRole,
        goal: result.goal,
        giveaway: result.giveawayManagers
    });
})
