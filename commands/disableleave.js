const mongo = require(`../mongo`);
const leaveSchema = require(`../Schemas/leave-schema`);

module.exports = {
    name: 'disableleave',
    type: 'admin',
    description: 'disables the leave command.',
    usage: '&{prefix}disableleave',
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        
        const msg = await message.channel.send(`Disabling the leave message.`);
        await mongo().then(async (mongoose)=>{
          
            await leaveSchema.findOneAndDelete({
                    _id: message.guild.id
                })
          
          msg.edit(`Successfully disabled the leave message.`);
          bot.leaves.delete(message.guild.id);
        })
    }
}