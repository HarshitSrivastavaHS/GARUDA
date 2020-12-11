module.exports = {
    name: 'google',
    description: 'searches the internet',
    execute: async (message, args, bot, Discord) => {
        const request = require("node-superfetch");
        let googleKey = process.env.GoogleAPI;
        let csx = process.env.GoogleCSX;
        
        let query = args.join(" ");
        if (!query) return message.channel.send("Please enter the query.");
        
        //href = await search(query);
        
    }
}
