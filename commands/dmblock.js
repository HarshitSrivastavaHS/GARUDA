const mongo = require(`../mongo`);
const blockedSchema = require(`../Schemas/blocked-schema`);
module.exports = {
    name: 'dmblock',
    type: 'fun',
    usage: '&{prefix}dmblock <user @>',
    description: 'Blocks that person from using the bot to dm you.',
    async execute(message, args, bot, Discord, prefix) {
      var user = message.mentions.users.first();
      if (!user) return message.channel.send(`Please mention the user.`);
      const msg = await message.channel.send("Please Wait...");
      let blockss = bot.blocks.get(message.author.id)?bot.blocks.get(message.author.id):[];
      if (blockss) {
        if (blockss.includes(user.id)) return msg.edit("That user is already blocked")
      }
      blockss[blockss.length] = user.id;
      await blockedSchema.findOneAndUpdate({
        _id: message.author.id
      },{
        _id: message.author.id,
        blocks: blockss
      },{
        upsert: true
      })
       msg.edit(`Successfully blocked ${user.username}`)

      bot.blocks.set(message.author.id, blockss);
    }    
}