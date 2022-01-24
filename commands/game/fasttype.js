module.exports = {
    name: 'fasttype',
    
    usage: '&{prefix}fasttype <optional number of words>',
    aliases: ["ft"],
    description: 'starts a typing game! You can define the number of words. Default: 10',
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        
        if (bot.fasttype.includes(message.channel.id)) return message.channel.send("**A Fasttype game is already going on in this channel.**");
        
        let { words } = require("../../util/fasttypeWords.json");
        words = [...words];
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
                return m.content!=undefined &&m.content.toLowerCase() == word.toLowerCase() && (!m.author.bot||(m.author.bot&&bot.allowedBots.includes(m.author.id)));
            }
            
            selectWord()
            bot.fasttype.push(message.channel.id);
            message.channel.send(`**The Game will start in 3 seconds.**\n**Total Rounds: ${maxWords}**`);
            
            setTimeout(()=>{
                message.channel.send(`**The Word is:  \`${chosenWord}\`**`);
                counter++;
            }, 3000)
            
            
            const collector = new Discord.MessageCollector(message.channel, {filter,
                max: maxWords,
                time: 10000
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
                if (Object.keys(points).length == 0 ) {
                   message.channel.send("**😕 Looks like nobody scored any points. 😕**");
                   bot.fasttype.splice(bot.fasttype.indexOf(message.channel.id), 1);
                   return;
                }
                let leaderboard = `<@${winner}>, +1 Point. Total Point${points[winner]==1?"":"s"}: ${points[winner]}\n\n🏆 The Game has Ended. Here is how everybody did: 🏆\n\n`;
                const sorted = Object.keys(points).sort((a,b)=>{
                    return points[b] - points[a];
                })
                
                for (const key of sorted) {
                    const amount = points[key];
                    leaderboard+= `<@${key}> had ${amount} point${amount === 1 ? '' : 's'}\n`
                }
                message.channel.send("**"+leaderboard+"**");
                bot.fasttype.splice(bot.fasttype.indexOf(message.channel.id), 1);
                let { words } = require("../../util/fasttypeWords.json");
            })
  }
}
