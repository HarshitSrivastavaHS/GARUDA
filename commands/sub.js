module.exports = {
    name: 'sub',
    description: 'subtracts numbers',
    type: 'maths',
    usage: '%sub <num1> <num2> <num3> ... <num-n>',
    execute(message, args, bot, Discord) {
        if (args.length <= 1) return message.channel.send("Please enter numbers to be subtracted.");
        let sub = parseFloat(args[0]);;
        let lhs = args.slice(1).join("-");
        try {
            sub = eval(`${sub}-${lhs}`);
        } catch {
            message.channel.send("Please enter numbers only.");
        }
        if (isNaN(sub)) return message.channel.send("Please enter numbers only.");
        message.channel.send(`${args[0]}-${lhs}=${sub}`);
    }
}
