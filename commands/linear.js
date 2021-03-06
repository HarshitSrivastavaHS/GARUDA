const mathsteps = require('mathsteps');
module.exports = {
    name: 'linear',
    type: 'maths',
    usage: `&{prefix}linear <expression>`,
    description: 'solves a mathematical linear equation (one variable only).',
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
        if (args.length<1) return message.channel.send("Run the command again but this time with the expression.");
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

          message.channel.send("Please type only linear equations in one variable."); 
          return;
        }

        message.channel.send(result, {code: true, split: true})

    }
}
