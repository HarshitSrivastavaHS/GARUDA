module.exports = {
    name: 'country',
    description: 'IN DEVELOPMENET',
    execute(message, args, bot, fs) {
        const code = args[0];
        const fetch = require("node-fetch");
        try {
            fetch(`https://restcountries.eu/rest/v2/alpha/${code}`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                message.channel.send(`Name: ${data.name}\nCapital: ${data.capital}\nRegion: ${data.region}\nCurrencies: ${data.currencies[0]["name"]}`);
            })
        }
        catch (err){
                message.channel.send(":broken-heart: Something went wrong");
        }
    }
}
