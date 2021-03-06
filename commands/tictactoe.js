const { tictactoe } = require('reconlx')
module.exports = {
    name: 'tictactoe',
    type: 'game',
    usage: `&{prefix}tictactoe <user's @>`,
    description: 'play tictactoe with someone',
    permissions: ['SEND_MESSAGES', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
        
        let player1 = message.author;
        let player2 = message.mentions.users.first() || bot.users.cache.get(args[0]) ;
        if (!player2) return message.channel.send("Please mention the user also.")
        if (player1 == player2) return message.channel.send("You cannot play with yourself.")
        if (player2.bot) return message.channel.send("You cannot play with a bot.")
        
        new tictactoe({
            player_two: player2, 
            message: message
        })
    }
}
