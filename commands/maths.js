module.exports = {
    name: 'maths',
    description: 'does simple maths calculations',
    execute(message, args, bot, Discord) {
        if (args[0]==="add") {
          //if (!args[1]==undefined||!args[2]==undefined){
            message.channel.send(`hi${args[1]}+${args[2]}=${args[1]+args[2]}`);
          //}
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
