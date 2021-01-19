const mongo = require(`../mongo`);
const suggestionSchema = require(`../Schemas/suggestion-schema`);

module.exports = {
    name: 'setsuggestion',
    description: 'sets the channel where suggestions will be sent',
    type: "admin",
    usage: `&{prefix}setsuggestion <suggestion channel>`,
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        if (args<1) return message.channel.send(`Invalid syntax. Do \`${prefix}help setsuggestion\` for more info.`)
        const CHANNELS_PATTERN = /<#(\d{17,19})>/g;
        const x = args[0].match(CHANNELS_PATTERN);
        if (!x) return message.channel.send(`Invalid syntax. Do \`${prefix}help setsuggestion\` for more info.`);
        let channel_id = (args[0].replace(/<#/g,"")).replace(/>/g,"");
        let msg = await message.channel.send(`Setting <#${channel_id}> as the suggestion channel.`);await suggestionSchema.findOneAndUpdate({
                    _id: message.guild.id
                },{
                    _id: message.guild.id,
                    channel_Id: channel_id,
                },{
                    upsert: true
                })
          msg.edit(`Successfully set the <#${channel_id}> as the suggestion channel.`)
          bot.suggestionChannel.set(message.guild.id, channel_id);
      
    }
}
