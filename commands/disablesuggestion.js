const mongo = require(`../mongo`);
const suggestionSchema = require(`../Schemas/suggestion-schema`);

module.exports = {
    name: 'disablesuggestion',
    type: 'admin',
    description: 'removes the suggestion channel.',
    usage: '&{prefix}disablesuggestion',
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        
        const msg = await message.channel.send(`Removing the suggestion channel.`);
        await mongo().then(async (mongoose)=>{
          
            await suggestionSchema.findOneAndDelete({
                    _id: message.guild.id
                })
          
          msg.edit(`Successfully removed the suggestion channel.`);
          bot.suggestionChannel.delete(message.guild.id);
        })
    }
}