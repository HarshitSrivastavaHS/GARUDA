const { words } = require("../util/fasttypeWords.json");

const games = {};
const stages = {
  STARTING: (counter)=>{
    return `A new "fast type" game is starting in ${counter}s!`
  },
  GAME_RUNNING: (word)=>{
    let sword = "";
    for (const char of [...word]) {
      sword += char;
      sword += " ";
    }
    return `The word is **${sword}**`;
  },
  ENDING: (points)=>{
    const sorted = Object.keys(points).sort((a,b)=>{
      return points[b] - points[a];
    })
    let results = "";
    for (const key of sorted) {
      const amount = points[key];
      results+= `<@${key}> had ${amount} point${amount === 1 ? '' : 's'}\n`
    }
    return `The game is now over. Here's how everyone did:\n\n${results?results:"Nobody scored any point :(\n"}------------------`
  }
}
const selectWord = (game)=>{
  game.currentWord = game.remainingWords[Math.floor(Math.random()*game.remainingWords.length)];
  const index = game.remainingWords.indexOf(game.currentWord);
  game.remainingWords.splice(index, 1);
}
const gameLoop = ()=>{
  for (const key in games) {
    const game = games[key];
    const {message, stage} = game;
    if (stage == "STARTING") {
      let string = stages[stage](game.counter);
      message.edit(string);
      if (game.counter<=0) {
        game.stage = "GAME_RUNNING"
        game.counter = 15;
        selectWord(game);
        string = stages[game.stage](game.currentWord);
        message.edit(string);
      }
    } else if (stage=="GAME_RUNNING") {
      if (game.counter <= 0 ) {
        game.stage = "ENDING";
        const string = stages[game.stage](game.points)
        message.edit(string);
        delete games[key];
        continue;
      }
    }
    --game.counter;
  }
  setTimeout(gameLoop, 2000);
}

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
      
    const { channel } = message;
    message.delete();
    channel.send('Preparing game...').then((message) => {
      games[channel.id] = {
        message,
        stage: 'STARTING',
        counter: 3,
        remainingWords: [...words],
        points: {
          
        },
      }
    })
    gameLoop();
    bot.on("message", message => {
      const { channel, content, member } = message;
      const { id } = channel;
      const game = games[id];
      if (game && game.currentWord && !member.user.bot) {
        message.delete();
        if (game.stage == "GAME_RUNNING" && game.currentWord.toLowerCase() == content.toLowerCase()) {
          game.currentWord= null;
          const seconds = 2;
          const {points} = game;
          points[member.id]= points[member.id] || 0;
          message.reply(`You won! +1 point (${++points[member.id]} total)`).then((newMessage) => {
            newMessage.delete({
              timeout: 1000 * seconds,
            })
          })
          
          setTimeout(()=>{
            if (game.stage == "GAME_RUNNING") {
              selectWord(game);
              const string = stages[game.stage](game.currentWord);
              game.message.edit(string);
            }
          }, 2000*seconds)
        }
      }
    })
  }
}
