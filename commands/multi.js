module.exports = {
    name: 'multi',
    description: 'multiplies numbers',
    type: 'maths',
    usage: '&{prefix}multi <num1> <num2> <num3> ... <num-n>',
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
        if (args.length <= 1) return message.channel.send("Please enter numbers to be added.");
        let mul = 1;
        let lhs = "";
        for (let num in args) {
            mul *= parseFloat(args[num]);
            lhs += (num!=0)?`\`*\`${args[num]}`:`${args[num]}`;
        }
        if (isNaN(mul)) return message.channel.send("Please enter numbers only.");
        message.channel.send(`${lhs}=${mul}`);
    }
}
