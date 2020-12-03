module.exports = {
    name: 'country',
    description: 'IN DEVELOPMENET',
    execute(message, args, bot, fs) {
        const code = args[0];
        if (code===undefined) {
            message.channel.send("%country <country code>"); 
            return;
        }
        const fetch = require("node-fetch");
        try {
            fetch(`https://restcountries.eu/rest/v2/alpha/${code}`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                if (data.name===undefined){
                    message.reply("Please enter a valid country code");
                    return;
                }
                let currency = "";
                for (let i = 0; i<data.currencies.length; i++){
                    if (i==0) {
                       currency = data.currencies[i].name;
                    }
                    currency += currency = currency + ", "+data.currencies[i].name;
                }
                message.channel.send(`Name: ${data.name}\nCapital: ${data.capital}\nRegion: ${data.region}\nCurrencies: ${currency}`);
            })
        }
        catch (err){
                message.channel.send(":broken-heart: Something went wrong");
        }
    }
}
