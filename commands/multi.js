module.exports = {
    name: 'multi',
    description: 'multiplies numbers',
    type: 'maths',
    usage: '&{prefix}multi <num1> <num2> <num3> ... <num-n>',
    async execute(message, args, bot, Discord, prefix) {
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
