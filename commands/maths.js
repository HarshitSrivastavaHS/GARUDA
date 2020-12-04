module.exports = {
    name: 'maths',
    description: 'does simple maths calculations',
    execute(message, args, bot, Discord) {
        if (args[0]==="add") {
            try {
                const sum = parseFloat(args[1])+parseFloat(args[2]);
            }
            catch {
                message.channel.send("Please enter numbers only.");
                return;
            }
            message.channel.send(`${args[1]}+${args[2]}=${sum}`);
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
