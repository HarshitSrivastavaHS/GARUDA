module.exports = {
    name: 'maths',
    description: 'does simple maths calculations',
    execute(message, args, bot, Discord) {
        if (args[0]==="add") {
            if (args[1]!=undefined&&args[2]!=undefined){
                const sum = parseFloat(args[1])+parseFloat(args[2]);
                message.channel.send(`${args[1]}+${args[2]}=${sum}`);
            }
            else {
                message.channel.send("Please enter numbers to be added.")
            }
        }
        
        else if (args[0]==="sub") {
          
        }
        
        else if (args[0]==="mul") {
          
        }
        
        else if (args[0]==="div") {
          
        }
        
        else if (args[0]==="eval") {
          
        }
        
        else {
          message.channel.send("Invalid syntax!");
        }
    }
}
