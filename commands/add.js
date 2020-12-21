module.exports = {
    name: 'add',
    description: 'adds two numbers',
    type: 'maths',
    execute(message, args, bot, Discord) {
//      if (args[0]!=undefined&&args[1]!=undefined){
//          const sum = parseFloat(args[0])+parseFloat(args[1]);
//          if (!isNaN(sum)) 
//              message.channel.send(`${args[0]}+${args[1]}=${sum}`);
//          else 
//              message.channel.send("Please enter numbers only.")
//          }
//      else {
//          message.channel.send("Please enter numbers to be added.")
//      }
        if (args.length <= 1) return message.channel.send("Please enter numbers to be added.");
        let sum = 0;
        for (let num in args) {
            sum += parseFloat(args[num]);
        }
        if (isNaN(sum)) return message.channel.send("Please enter numbers only.");
        message.channel.send(sum);
    }
}
