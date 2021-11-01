const Maths = require("exact-math"); 
module.exports = {
    name: 'maths',
    type: 'maths',
    usage: '&{prefix}mahts <expression>',
    description: 'solves a maths expression',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!args[0]) return message.channel.send("Please re-run the command, but this time with the expression.");
        let exp = args.join(" ");
        let sol;
        try {
          sol = Maths.formula(exp);
        }
        catch {
          return message.channel.send("Something went wrong. Was that really an expression?")
        }
        message.channel.send(`Expression: ${exp}\nSolution: ${sol}`).catch(()=>{message.reply("An error occurred.")});
    }
      
}
