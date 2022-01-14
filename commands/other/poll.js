module.exports = {
    name: 'poll',
    
    description: 'starts a poll',
    aliases: [],
    usage:'&{prefix}poll <question> \nor\n&{prefix}poll "question" "option1" "option2" ... "option9" ',
    permissions: ['SEND_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
      if (!message.member.permissions.has("MANAGE_GUILD")) return message.reply("You cannot run this command. Manage Server permission is required for this command.");
      if (!args[0]) {
        let pollembed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(`**GARUDA Poll Command**`)
        .addFields({
          name: `Yes/No`, value: `%poll Do you like GARUDA?`
        },{
          name: `Multiple Answers (2-9)`, value: `%poll "How is GARUDA?" "It's Amazing!" "Awesome" "Great"`
        }, {
          name: "Show the results of a poll", value: "%poll show <poll message id/poll message link>"
        })
        .setFooter(`Poll help menu.`)
        .setTimestamp();
        message.channel.send({embeds:[pollembed]});
        message.delete();
        return;
      }
      if (args[0].toLowerCase() == "show") {
        if (!args[1]) return message.reply("Please specify the message link/id");
        let id = args[1].substr(args[1].lastIndexOf("/")+1, args[1].length);
        let msg = await message.channel.messages.fetch(id).catch(()=>{
          return message.reply(`Message not found with id in this channel: \`${id}\``)
        })
        if (msg.author.id != bot.user.id) return msg.reply({content:`${message.author}, this message is not sent by me.`})
        if (!msg.content == "📊 POLL 📊" || !msg.embeds[0] || !msg.embeds[0].footer.text || !msg.embeds[0].footer.text.startsWith("Poll by")) return msg.reply(`${message.author}, This message does not contain a poll`);
        
        let options = [];
        let lines = msg.embeds[0].description.split("\n");
        let total = 0;
        for (let line of lines) {
          let reacts = msg.reactions.cache.get(line.substr(0, line.indexOf(" "))).count - 1;
          total += reacts
          options.push([line, reacts])
        }
        let str = []
        for (let i in lines) {
          //⬜⬛
          let string = ""
          for (let j = 1; j<= 10;j++) {
            if (j <= Math.floor(options[i][1]/total*10)) {
              string += "⬜";
            }
            else {
              string += "⬛"
            }
          }
          str.push(string);
        }
        let i = 0;
        let emb = new Discord.MessageEmbed()
        .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 4096})})
        .setTitle("Poll Results")
        .setColor("#FF6F61")
        .setTimestamp()
        .setDescription(`**Question:** ${msg.embeds[0].title}\n\n**Options**\n${options.map(e=>e.map(m=>m).join(" - ")+` ${e[1]>1?"votes":"vote"}\n${str[i++]}`).join("\n")}`)
        msg.reply({embeds: [emb]});
      }
      else {
        let polls = args.join(" ");
        let regex =  polls.match(/"[^"]+"|[\\S]+"[^"]+/g);
        if (!regex) {
          let pollembed = new Discord.MessageEmbed()
          .setColor("#FF6F61")
          .setTitle(`**${polls}**`)
          .setDescription("🇦 Yes\n🇧 No")
          .setFooter(`Poll by ${message.author.tag}`)
          .setTimestamp();
          message.channel.send({content:"**📊 POLL 📊**", embeds:[pollembed]}).then((msg)=>{
            msg.react("🇦").then(()=>{msg.react("🇧")})
          })
          message.delete();
          return;
        }
        if (regex.length>10) {
          return message.channel.send("Kindly specify only 10 options including the question.");
        }

        if (regex.length<3) {
          return message.channel.send("Kindly specify a question and at least two options. If you need a yes/no poll, only type the question without any \"");
        }

        const que = regex[0];
        regex = regex.slice(1);

        const emojis = [
          '🇦',
          '🇧',
          '🇨',
          '🇩',
          '🇪',
          '🇫',
          '🇬',
          '🇭',
          '🇮'
        ]

        let str = "";
        var i = 0;
        for(let opt of regex) {
          str += `${emojis[i]} ${opt}\n`;
          i++;
        }
        let pollembed = new Discord.MessageEmbed()
          .setColor("#EFC050")
          .setTitle(`**${que.replace(/"/g, "")}**`)
          .setDescription(str.replace(/"/g, ""))
          .setFooter(`Poll by ${message.author.tag}`)
          .setTimestamp();
        message.delete();
        const msg = await message.channel.send({content:"**📊 POLL 📊**", embeds:[pollembed]});
        for (var i = 0; i<regex.length;i++){
          msg.react(emojis[i]);
        }
      }
    }
}
