const mathsteps = require('mathsteps');
module.exports = {
    name: 'linear',
    type: 'maths',
    usage: `&{prefix}linear <expression>`,
    description: 'solves a mathematical linear equation (one variable only).',
    async execute(message, args, bot, Discord, prefix) {
        if (args.length<1) return message.channel.send("Run the command again but this time with the expression.");
        message.channel.startTyping();
        const steps = mathsteps.solveEquation(args.join(" "));
        let result = "";
        for (let step in steps) {
          if (step == 0) {
            result += steps[step].oldEquation.ascii()+"\n";
            continue;
          }
          result += "=> "+steps[step].oldEquation.ascii()+"\n";
        };
        try {
          result += "=> "+steps[steps.length-1].newEquation.ascii()+"\n";
        }
        catch {

          message.channel.stopTyping();
          message.channel.send("Please type only linear equations in one variable."); 
          return;
        }

        message.channel.stopTyping();
        message.channel.send(result, {code: true, split: true})

    }
}
