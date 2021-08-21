const mongo = require(`../../mongo`);
const afkConfig = require('../../Schemas/afk');
module.exports = {
    name: 'afk',
    usage: '&{prefix}afk <msg>',
    description: 'sets AFK.',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let afkmsg = args.length<1?"AFK":args.join(" ");
        if (afkmsg.includes("@everyone")||afkmsg.includes("@here")||(/<@&[0-9]+>/g).test(afkmsg)) return message.channel.send("AFK messages cannot contain everyone, here or role mentions.")
        message.reply(`AFK successfully set, msg: ${afkmsg}\nIt Would start working after 15 seconds :D`);
        setTimeout(()=>{
                bot.afk.set(message.author.id, {msg: afkmsg, time: Math.floor(message.createdTimestamp/1000)});
        }, 15000)
        
        await mongo().then(async (mongoose)=>{
          
            await afkConfig.findOneAndUpdate({
                    _id: message.author.id
                },{
                    _id: message.author.id,
                    afk: afkmsg,
                    time: Math.floor(message.createdTimestamp/1000)
                },{
                    upsert: true
                })
        })
    }
}
