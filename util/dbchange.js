const serverConfigurator = require('../functions/serverConfig');
const serverConfig = require('../Schemas/server-config');
module.exports = async (bot)=>{
    serverConfig.watch().on("change", (data)=>{
        serverConfigurator(bot, data.documentKey._id)
    })    
}