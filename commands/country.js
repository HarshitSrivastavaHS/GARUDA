module.exports = {
    name: 'country',
    description: 'IN DEVELOPMENET',
    execute(message, args, bot, fs) {
        const code = args[0];
        const fetch = require("node-fetch");
        try {
            fetch(`https://restcountries.eu/rest/v2/alpha/${code}`).then((res)=>{
                message.channel.send(JSON.parse(res.json));
            })
        }
        catch (err){
                message.channel.send(":broken-heart: Something went wrong");
                message.channel.send("Ignore the next message");
                message.channel.send(err);
        }
    }
}
