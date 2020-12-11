module.exports = {
    name: 'google',
    description: 'searches the internet',
    execute: async (message, args, bot, Discord) => {
        const request = require("node-superfetch");
        let googleKey = process.env.GoogleAPI;
        let csx = process.env.GoogleCSX;
        
        let query = args.join(" ");
        if (!query) return message.channel.send("Please enter the query.");
        
        href = await search(query);
        
        let searchemb = new Discord.MessageEmbed()
        .setAuthor(message.author.tag,message.author.displayAvatarURL)
        .setColor("RANDOM")
        .setTitle(query.title)
        .setDescription(href.snippet)
        .setImage(href.pagemap ? href.pagemap.cse_thumbnail[0].src : null)
        .setFooter("Powered by Google")
        .setTimestamp();
        
        message.channel.send(href.link);
        
        async function search(query) {
            const {body} = await request.get("https://www.googleapis.com/customsearch/v1").query({
                key: googleKey, cx: csx, safe: "off", q: query
            })
            if (!body.items) return null;
            else
            return body.items[0];
        }
    }
}
