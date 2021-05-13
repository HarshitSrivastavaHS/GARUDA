module.exports = {
    name: 'fasttype',
    type: 'game',
    usage: '&{prefix}fasttype <optional number of words>',
    aliases: [],
    description: 'starts a typing game! You can define the number of words. Default: 10',
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
        let { words } = require("../util/fasttypeWords.json");
        let chosenWord = "";
        let maxWords = 10;
        
        if (args[0]) {
            if (isNaN(args[0])) 
                return message.channel.send("**Please specify number of words only. This is optional. Default: 10**")
            if (Number(args[0])<3||Number(args[0])>25)
                return message.channel.send("**Number of words cannot be greater than 25 or less than 3.**");
            maxWords = args[0];
        }
        
            let counter = 0;
            
            let word;
            
            let points = {};
            
            const selectWord = (game)=>{
                word = words[Math.floor(Math.random()*words.length)];
                const index = words.indexOf(word);
                chosenWord = word.split("").join(" ")
                /*for (const char of [...word]) {
                    chosenWord += char;
                    chosenWord += " ";
                }*/
                words.splice(index, 1);
            }
            
            const filter = m =>{
                return m.content.toLowerCase() == word.toLowerCase() && !m.author.bot;
            }
            
            selectWord()
            
            message.channel.send(`**The Game will start in 3 seconds.**\n**Total Rounds: ${maxWords}**`);
            
            setTimeout(()=>{
                message.channel.send(`**The Word is:  \`${chosenWord}\`**`);
                counter++;
            }, 3000)
            
            
            const collector = new Discord.MessageCollector(message.channel, filter, {
                max: maxWords,
                time: 10*1000
            })
            let winner;
            collector.on("collect", (m)=>{
                
                points[m.author.id] = points[m.author.id]?points[m.author.id]+1:1;
                winner = m.author.id;
                if (counter < maxWords) {
                    chosenWord = "";
                    collector.resetTimer();
                    selectWord();
                    setTimeout(()=>{
                        message.channel.send(`**<@${m.author.id}>, +1 Point. Total Point${points[m.author.id]==1?"":"s"}: ${points[m.author.id]}**\n\n**The Word is:  \`${chosenWord}\`**`);
                        counter++;
                    }, 2000);
                }
            })
            
            collector.on("end", collected => {
                if (Object.keys(points).length == 0 ) return message.channel.send("**😕 Looks like nobody scored any points. 😕**")
                let leaderboard = `<@${winner}>, +1 Point. Total Point${points[winner]==1?"":"s"}: ${points[winner]}\n\n🏆 The Game has Ended. Here is how everybody did: 🏆\n\n`;
                const sorted = Object.keys(points).sort((a,b)=>{
                    return points[b] - points[a];
                })
                
                for (const key of sorted) {
                    const amount = points[key];
                    leaderboard+= `<@${key}> had ${amount} point${amount === 1 ? '' : 's'}\n`
                }
                message.channel.send("**"+leaderboard+"**");
                let { words } = require("../util/fasttypeWords.json");
            })
  }
}
