module.exports = {
    name: 'google',
    description: 'searches the internet',
    execute: async (message, args, bot, Discord) => {
        const request = require("node-superfetch");
        let googleKey = process.env.GoogleAPI;
        let csx = process.env.GoogleCSX;
        
        let query = args.join(" ");
        if (!query) return message.channel.send("Please enter the query.");
        
        try {
        href = await search(query);
        }
        catch {
           message.channel.send("something went wrong.");
        }
      
        let searchemb = new Discord.MessageEmbed()
        .setAuthor(message.author.tag,message.author.displayAvatarURL)
        .setColor("RANDOM")
        .setTitle(href.title)
        .setURL(href.link)
        .setDescription(href.snippet)
        .setImage(href.pagemap ? href.pagemap.cse_thumbnail[0].src : null)
        .setFooter("Powered by Google")
        .setTimestamp();
        
        message.channel.send(searchemb);
        
        async function search(query) {
            const {body} = await request.get("https://www.googleapis.com/customsearch/v1").query({
                key: googleKey, cx: csx, safe: "off", q: query
            });
            
            console.log(body.items);
            console.log(body.items[0]);
           
            message.channel.send("Something went wrong.");
 
            if (!body.items) return null;
            else
            return body.items[0];
        }
    }
}
