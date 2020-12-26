module.exports = {
    name: 'leave',
    type: 'music',
    description: 'leaves the voice channel.',
    async execute(message, args, bot, Discord, prefix) {
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send("You must be in a voice channel to use this command.");
        // if (message.guild.voice.connection) {
        //     if (voiceChannel==message.guild.voice.connection.channel.id){
        //         await voiceChannel.leave();
        //         message.channel.send("**:mailbox_closed: Successfully Disconnected.**");
        //     }
        //     else {
        //         message.channel.send("**The bot isn't there in that voice channel.**");
        //     }
        // }
        // else {
        //     message.channel.send("The bot isn't in any voice channels.");
        // }
        await voiceChannel.leave();
        message.channel.send("**:mailbox_closed: Successfully Disconnected.**");
    }
}
