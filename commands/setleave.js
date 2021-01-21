const mongo = require(`../mongo`);
const leaveSchema = require(`../Schemas/leave-schema`);

module.exports = {
    name: 'setleave',
    type: 'admin',
    description: 'sets the leaves channel.',
    usage: '&{prefix}setleave <#channel>',
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        if (args.length<1) return message.channel.send("Please mention the channel. ") 
        const CHANNELS_PATTERN = /<#(\d{17,19})>/g;
        const x = args[0].match(CHANNELS_PATTERN);
        if (!x) return message.channel.send(`Invalid syntax. Do \`${prefix}help setleave\` for more info.`);
        let channel_id = (args[0].replace(/<#/g,"")).replace(/>/g,"");
        const msg = await message.channel.send(`Setting <#${channel_id}> as the leave message channel.`);
        await mongo().then(async (mongoose)=>{
          
            await leaveSchema.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    chID: channel_id
                },{
                    upsert: true
                })
          
          msg.edit(`Successfully set the <#${channel_id}> as the leaves channel.`);
          bot.leaves.set(message.guild.id, channel_id);
        })
    }
}