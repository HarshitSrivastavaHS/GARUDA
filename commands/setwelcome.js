const mongo = require(`../mongo`);
const welcomeSchema = require(`../Schemas/welcome-Schema`);

module.exports = {
    name: 'setwelcome',
    type: 'admin',
    description: 'sets the welcome channel.',
    usage: '&{prefix}setwelcome <#channel>',
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        if (args.length<1) return message.channel.send("Please mention the channel. ") 
        const CHANNELS_PATTERN = /<#(\d{17,19})>/g;
        const x = args[0].match(CHANNELS_PATTERN);
        if (!x) return message.channel.send(`Invalid syntax. Do \`${prefix}help setwelcome\` for more info.`);
        let channel_id = (args[0].replace(/<#/g,"")).replace(/>/g,"");
        const msg = await message.channel.send(`Setting <#${channel_id}> as the welcome channel.`);
        await mongo().then(async (mongoose)=>{
          
            await welcomeSchema.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    chID: channel_id
                },{
                    upsert: true
                })
          
          msg.edit(`Successfully set the <#${channel_id}> as the welcome channel.`);
          bot.welcome.set(message.guild.id, {
            chID: channel_id
          });
        })
    }
}