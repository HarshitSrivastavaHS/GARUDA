const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = {
    name: 'play',
    type: 'music',
    description: 'play\'s music according to the search query.',
    execute: async (message, args, bot, Discord) => {
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send("You must be in a voice channel to use this command.");

        if (!args.length) return message.channel.send("You must specify the video url or a query to search for the video.");
        
        // let connection = "";

        // if (message.guild.voice) {
        //     if (voiceChannel != message.guild.voice.connection.channel.id){
        //         connection = await voiceChannel.join();
        //         message.channel.send(`**Joined \`${voiceChannel.name}\`!**`);
        //     }
        //     else {
        //         connection = message.guild.voice.connection;
        //     }
        // }
        // else {
        //     connection = await voiceChannel.join();
        //     message.channel.send(`**Joined \`${voiceChannel.name}\`!**`);
        // }

        const connection = await voiceChannel.join();
        message.channel.send(`**Joined \`${voiceChannel.name}\`!**`);

        const videoFinder = async (query) => {
            message.channel.send(`**Searching :mag_right: \`${query}\` on youtube.**`)
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length>1)?videoResult.videos[0]:null;
        }

        const video = await videoFinder(args.join(" "));
        if (video) {
            message.channel.send(`**Playing :notes: \`${video.title}\` - Now!**`);
            const vid = ytdl(video.url, {filter: "audioonly"})
            connection.play(vid, {seek: 0, volume: 1})
            .on("finish", ()=>{
                message.channel.send(`**Finished Playing \`${video.title}\` - Disconnected Successfully.**`);
                voiceChannel.leave();
            })
        }
        else {
            message.channel.send("No result found.")
        }
    }
}
