module.exports = {
    name: 'country',
    description: 'IN DEVELOPMENET',
    execute(message, args, bot, fs) {
        const code = args[0];
        try {
            fetch(`https://restcountries.eu/rest/v2/alpha/${code}`).then((res)=>{
                return res.json;
            }).then((data)=>{
                message.channel.send(data);
            })
        }
        catch (err) {
            message.channel.send(":broken_heart: An error occured.");
            message.channel.send("Ignore the next message");
            message.channel.send(err);
        }
    }
}
