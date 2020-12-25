const mongo = require(`../mongo`);
const welcomeSchema = require(`../Schemas/welcome-schema`);
module.exports = {
    name: 'jointest',
    description: 'sends welcome message in the set channel.',
    async execute(message, args, bot, Discord) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Only an administrator can run this.");
        let data = bot.welcomeChannel.get(message.guild.id);
        if (!data) {
          await mongo().then(async (mongoose)=>{
            try {
              const result = await welcomeSchema.findOne({
                _id: message.guild.id
              })
              data = result!=null?[result.channelId, result.text]:null;
            }
            finally {
              mongoose.connection.close()
            }
          })
        }
        if (data!=null) {
          console.log(data[0]);
          console.log(data.welChannel)
          const channelID = data[0]?data[0]:data.welChannel;
          console.log(channelID)
          const text = data[1]?data[1]:data.welMessage;
          const channel = message.guild.channels.cache.get(channelID);
          console.log(channel)
          channel.send(text);
          bot.welcomeChannel.set(message.guild.id, {
          welChannel: channelID,
          welMessage: text
        })
        }
        else {
          message.channel.send("Please set the welcome channel first. Do `%help setwelcome`");
        }   
    }
}
