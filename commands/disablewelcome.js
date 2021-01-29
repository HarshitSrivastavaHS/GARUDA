const mongo = require(`../mongo`);
const welcomeSchema = require(`../Schemas/welcome-Schema`);

module.exports = {
    name: 'disablewelcome',
    type: 'admin',
    description: 'disables the welcome command.',
    usage: '&{prefix}disablewelcome',
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can use this command.");
        
        const msg = await message.channel.send(`Disabling the welcome message.`);
        await mongo().then(async (mongoose)=>{
          
            await welcomeSchema.findOneAndDelete({
                    _id: message.guild.id
                })
          
          msg.edit(`Successfully disabled the welcome message.`);
          bot.welcome.delete(message.guild.id);
        })
    }
}