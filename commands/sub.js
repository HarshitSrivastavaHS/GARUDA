module.exports = {
    name: 'sub',
    description: 'subtracts numbers',
    type: 'maths',
    usage: '&{prefix}sub <num1> <num2> <num3> ... <num-n>',
    async execute(message, args, bot, Discord, prefix) {
        if (args.length <= 1) return message.channel.send("Please enter numbers to be subtracted.");
        let sub = parseFloat(args[0]);;
        let lhs = "";
        for (let num in args) {
            if (num != 0)
                sub -= parseFloat(args[num]);
            lhs += (num!=0)?`-${args[num]}`:`${args[num]}`;
        }
        if (isNaN(sub)) return message.channel.send("Please enter numbers only.");
        message.channel.send(`${lhs}=${sub}`);
    }
}
