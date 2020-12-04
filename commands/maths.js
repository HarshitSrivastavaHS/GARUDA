module.exports = {
    name: 'maths',
    description: 'does simple maths calculations',
    execute(message, args, bot, Discord) {
        if (args[0]==="add") {
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
        
        else if (args[0]==="sub") {
            if (args[1]!=undefined&&args[2]!=undefined){
                const diff = parseFloat(args[1])-parseFloat(args[2]);
                if (!isNaN(diff))
                    message.channel.send(`${args[1]}-${args[2]}=${diff}`);
                else 
                    message.channel.send("Please enter numbers only.")
            }
            else {
                message.channel.send("Please enter numbers to be subtracted.")
            }
        }
        
        else if (args[0]==="mul") {
            if (args[1]!=undefined&&args[2]!=undefined){
                const pro = parseFloat(args[1])*parseFloat(args[2]);
                if (!isNaN(pro))
                    message.channel.send(`${args[1]}*${args[2]}=${pro}`);
                else 
                    message.channel.send("Please enter numbers only.")
            }
            else {
                message.channel.send("Please enter numbers to be multiplied.")
            }  
        }
        
        else if (args[0]==="div") {
            if (args[1]!=undefined&&args[2]!=undefined){
                const quo = parseFloat(args[1])/parseFloat(args[2]);
                if (!isNaN(quo) || quo==infinity)
                    message.channel.send(`${args[1]}/${args[2]}=${quo}`);
                else 
                    message.channel.send("Please enter numbers only.")
            }
            else {
                message.channel.send("Please enter numbers to be divided.")
            }  
        }
        
        else if (args[0]==="eval") {
          
        }
        
        else {
          message.channel.send("Invalid syntax!");
        }
    }
}
