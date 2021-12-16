const {Aki} = require("aki-api");
const Discord = require("discord.js")
async function askQuestion(message, aki) {
    setTimeout(async ()=>{
        let bot = message.client;
        let btn1 =  new Discord.MessageButton()
                .setCustomId("0")
                .setLabel("✅ Yes")
                .setStyle("SECONDARY")
        let btn2 = new Discord.MessageButton()
                .setCustomId("1")
                .setLabel("❌ No")
                .setStyle("SECONDARY") 
        let btn3 = new Discord.MessageButton()
                .setCustomId("2")
                .setLabel("❓ Don't know")
                .setStyle("SECONDARY") 
        let btn4 = new Discord.MessageButton()
                .setCustomId("3")
                .setLabel("👍 Probably")
                .setStyle("SECONDARY")
        let btn5 = new Discord.MessageButton()
                .setCustomId("4")
                .setLabel("👎 Probably not")
                .setStyle("SECONDARY")
        let btn6 = new Discord.MessageButton()
                .setCustomId("5")
                .setLabel("🔙 Back")
                .setStyle("SECONDARY")
        let btn7 = new Discord.MessageButton()
                .setCustomId("6")
                .setLabel("🛑 Stop")
                .setStyle("DANGER")
        let row = new Discord.MessageActionRow().addComponents(btn1, btn2, btn3, btn4, btn5);
        row2 = new Discord.MessageActionRow().addComponents(btn6, btn7);
        let emb = new Discord.MessageEmbed()
            .setTitle(`Question ${aki.currentStep + 1}`)
            .setDescription(`**Progress: ${Math.floor(aki.progress*10)/10}**\n**Q) ${aki.question}**`)
            .setColor("#00FFFF")
        let msg = await message.channel.send({embeds: [emb], components: [row, row2]});
        const collector = new Discord.InteractionCollector(bot, {message: msg, type: "MESSAGE_COMPONENT", time: 60000});
        let answer = -1;
        collector.on("collect", (interaction)=>{
            if (interaction.user.id != message.author.id) return interaction.reply({content: "You cannot use these buttons.", ephemeral: true});
            interaction.deferReply();
            interaction.deleteReply();
            answer = interaction.customId;
            collector.stop("answer");
        })
        collector.on("end", async (reason)=>{
            btn1.setDisabled();
            btn2.setDisabled();
            btn3.setDisabled();
            btn4.setDisabled();
            btn5.setDisabled();
            btn6.setDisabled();
            btn7.setDisabled();
            row = new Discord.MessageActionRow().addComponents(btn1, btn2, btn3, btn4, btn5);
            row2 = new Discord.MessageActionRow().addComponents(btn6, btn7);
            if (answer == -1) {
                bot.aki.splice(bot.aki.indexOf(message.author.id), 1);
                return msg.edit({content: `**The game ended due to 1 minute of inactivity**`,embeds: [emb],  components:[row, row2]});
            }
            let answers = [
                "Yes",
                "No",
                "Don't know",
                "Probably",
                "Probably not",
                "Previous Question",
                "Stop"
            ]
            emb.setDescription(`${emb.description}\nA) ${answers[answer]}`);
            msg.edit({embeds: [emb],  components:[row, row2]});
            if (answer == 6) {
                await aki.win();
                bot.aki.splice(bot.aki.indexOf(message.author.id), 1);
                return msg.reply("Game stopped by the player.");
            }
            if (answer == 5) {
                await aki.back();
                return askQuestion(message, aki);
            }
            checkGuess(message, aki, answer);
        })
    },1500)
}
async function checkGuess(message, aki, answer) {
    await aki.step(answer);
    if (aki.progress >= 95 || aki.currentStep >= 50) {
        return win(message, aki);
    }
    message.channel.sendTyping();
    askQuestion(message, aki);
}
async function win(message, aki) {
    let bot = message.client;
    await aki.win();
    let btn1 =  new Discord.MessageButton()
            .setCustomId("0")
            .setLabel("✅ Yes")
            .setStyle("SUCCESS")
    let btn2 = new Discord.MessageButton()
            .setCustomId("1")
            .setLabel("❌ No")
            .setStyle("DANGER")
    let row = new Discord.MessageActionRow().addComponents(btn1, btn2);
    let emb = new Discord.MessageEmbed()
        .setTitle("Is this your character?")
        .setDescription(`**${aki.answers[0].name}**\n${aki.answers[0].description}\nRanking as **#${aki.answers[0].ranking}**`)
        .setImage(aki.answers[0].absolute_picture_path)
        .setColor("#00FFFF");
    let msg = await message.channel.send({embeds: [emb], components: [row]});
    const collector = new Discord.InteractionCollector(bot, {message: msg, type: "MESSAGE_COMPONENT", time: 30000});
    let answer = -1;
    collector.on("collect", (interaction)=>{
        if (interaction.user.id != message.author.id) return interaction.reply({content: "You cannot use these buttons.", ephemeral: true});
        interaction.deferReply();
        interaction.deleteReply();
        answer = interaction.customId;
        collector.stop("answer");
    })
    collector.on("end", async (reason)=>{
        btn1.setDisabled();
        btn2.setDisabled();
        row = new Discord.MessageActionRow().addComponents(btn1, btn2);
        msg.edit({content: `**${answer == 0?"I  guessed it right!":answer == 1? "Guessed it wrong :(":"OwO"}**`, embeds: [emb], components:[row]});
        bot.aki.splice(bot.aki.indexOf(message.author.id), 1);
    })
}
module.exports = {
    name: 'akinator',
    usage: `&{prefix}akinator`,
    description: 'akinator that can guess the character you\'re thingking about',
    aliases: ["aki"],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        if (bot.aki.includes(message.author.id)) return message.reply("A game started by you is already running.");
        bot.aki.push(message.author.id);
        let msg = message.reply("**Starting game**")
        message.channel.sendTyping();
        const aki = new Aki({region: "en", childMode: true, proxy: undefined});
        await aki.start();
        askQuestion(message, aki, msg);
    }
}
