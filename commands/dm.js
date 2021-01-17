const mongo = require(`../mongo`);
const blockedSchema = require(`../Schemas/blocked-schema`);
module.exports = {
    name: 'dm',
    type: 'fun',
    usage: '&{prefix}dm <user @> <message here>',
    description: 'dm someone using the bot.',
    async execute(message, args, bot, Discord, prefix) {
        if (args.length <= 1) return message.channel.send(`Invalid Syntax. ${prefix}help dm for more info.`)
        const user = message.mentions.users.first();
        const mention_reg = /<@!?(\d{17,19})>/g;
        if (!user || !(args[0].match(mention_reg))) return message.channel.send(`Invalid Syntax. ${prefix}help dm for more jnfo.`);
        const msg = args.slice(1).join(" ");
        if (!msg) return message.channel.send("Please enter the message to be sent.");
        const mesg = await message.channel.send("Please wait");
        let blockss = bot.blocks.get(user.id)?bot.blocks.get(user.id):null;
        if (!blockss) {
          await mongo().then(async (mongoose)=>{
            
              const result = await blockedSchema.findOne({
                  _id: user.id
                })
              blockss = result!=null?result.blocks:null;
            
          })
        }
        if (blockss!= null) {
          bot.blocks.set(user.id, blockss);

          if (blockss.includes(message.author.id)) { 
            mesg.edit("You cannot send a message to that user using this bot. That user has blocked you.");
            message.delete();
            return
          }
        }

        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        .setDescription(msg)
        .setColor("GREEN")
        .setTimestamp()
        .setFooter("Do %dmblock @user to block that user.");
        user.send(embed);
        mesg.edit("Message sent successfully.");
        message.delete();

    }
}