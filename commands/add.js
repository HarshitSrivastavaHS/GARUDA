module.exports = {
    name: 'add',
    description: 'adds numbers',
    type: 'maths',
    usage: '%add <num1> <num2> <num3> ... <num-n>',
    execute(message, args, bot, Discord) {
        if (args.length <= 1) return message.channel.send("Please enter numbers to be added.");
        let sum = 0;
        let lhs = "";
        for (let num in args) {
            sum += parseFloat(args[num]);
            lhs += (num!=0)?`+${args[num]}`:`${args[num]}`;
        }
        if (isNaN(sum)) return message.channel.send("Please enter numbers only.");
        message.channel.send(`${lhs}=${sum}`);
    }
}
