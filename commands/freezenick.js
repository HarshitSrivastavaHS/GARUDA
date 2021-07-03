
const mongo = require(`../mongo`);

const freezerConfig = require('../Schemas/freezenick');

module.exports = {

    name: 'freezenick',

    usage: '&{prefix}freezenick <set/remove> <@user> <new nick>',

    description: 'Freezes nick so that it cannot be changed.',

    aliases: [],

    permissions: ['SEND_MESSAGES', 'MANAGE_NICKNAMES'],

    async execute(message, args, bot, Discord, prefix) {

       if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Only an admin can use this command.");



       if (!args[0]) {

              let emb = new Discord.MessageEmbed()

               .setColor("GREEN")

               .setTitle("Freenick help menu")

               .setDescription(`**Set**\n${prefix}freezenick set @Multi A programmer lol\n**Remove**\n${prefix}freezenick remove @Multi`)

       message.channel.send(emb);

        }

        /*

        await mongo().then(async (mongoose)=>{

          

            await freezerConfig.findOneAndUpdate({

                    _id: `${message.guild.id}-${message.author.id}`

                },{

                    _id: `${message.guild.id}-${message.author.id}`,

                    nick: afkmsg,

                },{

                    upsert: true

                })

        })*/

    }

}
