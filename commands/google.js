module.exports = {
    name: 'google',
    description: 'searches the internet',
    execute:  (message, args, bot, Discord) => {
        const request = require("node-superfetch");
        let googleKey = process.env.GoogleAPI;
        let csx = process.env.GoogleCSX;
        
        let query = args.join(" ");
        if (!query) return message.channel.send("Please enter the query.");
        let href = "";
        function search(query) {
            const {body} = request.get("https://www.googleapis.com/customsearch/v1").query({
                key: googleKey, cx: csx, safe: "off", q: query
            });
           
            message.channel.send("Something went wrong.");
            
            if (!body.items) return;
            
            return body.items[0];
        }
        try {
        href = search(query);
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
        
        function search(query) {
            const {body} = request.get("https://www.googleapis.com/customsearch/v1").query({
                key: googleKey, cx: csx, safe: "off", q: query
            });
           
            message.channel.send("Something went wrong.");
            
            if (!body.items) return;
            
            return body.items[0];
        }
    }
}
