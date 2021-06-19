const { tictactoe } = require('reconlx')
module.exports = {
    name: 'tictactoe',
    type: 'game',
    usage: `&{prefix}tictactoe <user's @>`,
    description: 'play tictactoe with someone',
    aliases: ["ttt"],
    permissions: ['SEND_MESSAGES', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
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
