const Maths = require("mathjs"); 
module.exports = {
    name: 'maths',
    type: 'maths',
    usage: '&{prefix}mahts <expression>',
    description: 'solves a maths expression',
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
        if (!args[0]) return message.channel.send("Please re-run the command, but this time with the expression.");
        let exp = args.join(" ");
        let sol;
        try {
          sol = Maths.evaluate(exp);
        }
        catch {
          return message.channel.send("Something went wrong. Was that really an expression?")
        }
        message.channel.send(`Expression: ${exp}\nSolution: ${sol}`);
    }
      
}
