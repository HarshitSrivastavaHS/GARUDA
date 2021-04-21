const { words } = require("../util/fasttypeWords.json");

module.exports = {
    name: 'fasttype',
    type: 'game',
    usage: '&{prefix}fasttype',
    description: 'starts a typing game!',
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
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
        
        let chosenWord = "";
            maxWords = 10;
            
            let counter = 0;
            
            let word;
            
            let points = {};
            
            const selectWord = (game)=>{
                word = words[Math.floor(Math.random()*words.length)];
                const index = words.indexOf(word);
                chosenWord
                for (const char of [...word]) {
                    chosenWord += char;
                    chosenWord += " ";
                }
                words.splice(index, 1);
            }
            
            const filter = m =>{
                return m.content.toLowerCase() == word.toLowerCase() && !m.author.bot;
            }
            
            selectWord()
            
            message.channel.send("**The Game will start in 3 seconds.**");
            
            setTimeout(()=>{
                message.channel.send(`**The Word is:  \`${chosenWord}\`**`);
            }, 3000)
            
            
            const collector = new Discord.MessageCollector(message.channel, filter, {
                max: maxWords,
                time: 10*1000
            })
            
            collector.on("collect", (m)=>{
                
                points[m.author.id] = points[m.author.id]?points[m.author.id]+1:1;
                
                message.channel.send(`**<@${m.author.id}>, +1 Point. Total Point${points[m.author.id]==1?"":"s"}: ${points[m.author.id]}**`)
                
                if (counter < maxWords) {
                    chosenWord = "";
                    collector.resetTimer();
                    selectWord();
                    setTimeout(()=>{
                        message.channel.send(`**The Word is:  \`${chosenWord}\`**`);
                    }, 1000);
                }
            })
            
            collector.on("end", collected => {
                if (Object.keys(points).length == 0 ) return message.channel.send("**😕 Looks like nobody participated 😕**")
                let leaderboard = "🏆 The Game has Ended. Here is how everybody did: 🏆\n\n";
                const sorted = Object.keys(points).sort((a,b)=>{
                    return points[b] - points[a];
                })
                
                for (const key of sorted) {
                    const amount = points[key];
                    leaderboard+= `<@${key}> had ${amount} point${amount === 1 ? '' : 's'}\n`
                }
                message.channel.send("**"+leaderboard+"**")
                
            })
  }
}
