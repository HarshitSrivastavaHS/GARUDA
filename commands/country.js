module.exports = {
    name: 'country',
    description: 'IN DEVELOPMENET',
    execute(message, args, bot, fs) {
        const code = args[0];
        const country = fs.readFile(`https://restcountries.eu/rest/v2/alpha/${code}`)
        message.channel.send("Still in development");
        message.channel.send("Test messages below:::Please Ignore");
        message.channel.send(JSON.parse(country));
    }
}
