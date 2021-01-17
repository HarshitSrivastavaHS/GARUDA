const mongo = require(`../mongo`);
const blockedSchema = require(`../Schemas/blocked-schema`);
module.exports = {
    name: 'dmunblock',
    type: 'fun',
    usage: '&{prefix}dmunblock <user @>',
    description: 'Unlocks a blocked person so that he/she can dm you using the bot.',
    async execute(message, args, bot, Discord, prefix) {
      var user = message.mentions.users.first();
      if (!user) return message.channel.send(`Please mention the user.`);
      const msg = await message.channel.send("Please Wait...");

      let blockss = bot.blocks.get(message.author.id)?bot.blocks.get(message.author.id):[];
      if (blockss) {
        if (!(blockss.includes(user.id))) return msg.edit("That user is not blocked");
      }
      const index = blockss.indexOf(user.id);
      blockss.splice(index,1);
      await blockedSchema.findOneAndUpdate({
        _id: message.author.id
      },{
        _id: message.author.id,
        blocks: blockss
      },{
        upsert: true
      })
      msg.edit(`Successfully unblocked ${user.username}`)
        
      bot.blocks.set(message.author.id, blockss);
    
    }    
}