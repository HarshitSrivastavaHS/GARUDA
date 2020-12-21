module.exports = {
    name: 'add',
    description: 'adds two numbers',
    type: 'maths',
    execute(message, args, bot, Discord) {
        if (args[1]!=undefined&&args[2]!=undefined){
          const sum = parseFloat(args[1])+parseFloat(args[2]);
          if (!isNaN(sum)) 
            message.channel.send(`${args[1]}+${args[2]}=${sum}`);
          else 
            message.channel.send("Please enter numbers only.")
          }
          else {
            message.channel.send("Please enter numbers to be added.")
          }
        }
    }
}
