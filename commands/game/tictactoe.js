const { Interaction } = require("discord.js");

async function checkWin(gameboard, btn){
    let row = btn.customId.substring(0,1);
    row = (row == "a"? 0 : row == "b" ? 1 : 2);
    let column = parseInt(btn.customId.substring(1,2))-1
    //check horizontally
    let rowToCheck = row;
    let colToCheck = column-1;

    let cell = gameboard[row][column];
    let winningCells = [[row, column]];
    while (colToCheck >=0) {
        const cellToCheck = gameboard[rowToCheck][colToCheck];
        if (cellToCheck != null && cellToCheck.name == cell.name) {
            winningCells.push([rowToCheck, colToCheck]);
        }
        else {
            break;
        }
        colToCheck--;
    }
    colToCheck = column+1;
    while (colToCheck < 3) {
        const cellToCheck = gameboard[rowToCheck][colToCheck];
        
        if (cellToCheck != null && cellToCheck.name == cell.name) {
            winningCells.push([rowToCheck, colToCheck]);
        }
        else {
            break;
        }
        colToCheck++;
    }
    if (winningCells.length == 3) {
        return true;
    }
    //check Vertically
    winningCells = [[row, column]];
    rowToCheck = row-1;
    colToCheck = column;
    while (rowToCheck >=0) {
        const cellToCheck = gameboard[rowToCheck][colToCheck];
        if (cellToCheck != null && cellToCheck.name == cell.name) {
            winningCells.push([rowToCheck, colToCheck]);
        }
        else {
            break;
        }
        rowToCheck--;
    }
    rowToCheck = row+1;
    while (rowToCheck < 3) {
        const cellToCheck = gameboard[rowToCheck][colToCheck];
        
        if (cellToCheck != null && cellToCheck.name == cell.name) {
            winningCells.push([rowToCheck, colToCheck]);
        }
        else {
            break;
        }
        rowToCheck++;
    }
    if (winningCells.length == 3) {
        return true;
    }
    //check right diagonally 
    winningCells = [[row, column]];
    rowToCheck = row+1;
    colToCheck = column-1;
    while (colToCheck >=0 && rowToCheck < 3) {
        const cellToCheck = gameboard[rowToCheck][colToCheck];
        if (cellToCheck != null && cellToCheck.name == cell.name) {
            winningCells.push([rowToCheck, colToCheck]);
        }
        else {
            break;
        }
        rowToCheck++;
        colToCheck--;
    }
    colToCheck = column+1;
    rowToCheck = row-1;
    while (rowToCheck >= 0 && colToCheck < 3) {
        const cellToCheck = gameboard[rowToCheck][colToCheck];
        
        if (cellToCheck != null && cellToCheck.name == cell.name) {
            winningCells.push([rowToCheck, colToCheck]);
        }
        else {
            break;
        }
        rowToCheck--;
        colToCheck++;
    }
    if (winningCells.length == 3) {
        return true;
    }
    //check left diagonally 
    winningCells = [[row, column]];
    rowToCheck = row-1;
    colToCheck = column-1;
    while (colToCheck >=0 && rowToCheck >= 0) {
        const cellToCheck = gameboard[rowToCheck][colToCheck];
        if (cellToCheck != null && cellToCheck.name == cell.name) {
            winningCells.push([rowToCheck, colToCheck]);
        }
        else {
            break;
        }
        rowToCheck--;
        colToCheck--;
    }
    colToCheck = column+1;
    rowToCheck = row+1;
    while (rowToCheck < 3 && colToCheck < 3) {
        const cellToCheck = gameboard[rowToCheck][colToCheck];
        
        if (cellToCheck != null && cellToCheck.name == cell.name) {
            winningCells.push([rowToCheck, colToCheck]);
        }
        else {
            break;
        }
        rowToCheck++;
        colToCheck++;
    }
    if (winningCells.length == 3) {
        return true;
    }
    return false;
}

module.exports = {
    name: 'tictactoe',
    usage: `&{prefix}tictactoe <user's @>`,
    description: 'play tictactoe with someone',
    aliases: ["ttt"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
    let mention = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first(): undefined;
    if (!mention) return message.reply("You forgot to tag your opponent :/");
	if (mention.user.id == message.author.id) return message.reply("You cannot play with yourself :/");
	if (mention.user.bot) return message.reply(`You cannot play with a bot`);
    let yes = new Discord.MessageButton()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle("SUCCESS");
    let no = new Discord.MessageButton()
        .setCustomId("no")
        .setLabel("No")
        .setStyle("DANGER");
    let row = new Discord.MessageActionRow().addComponents(yes, no)
    let choicemsg = await message.channel.send({content: `${mention}, ${message.author} has challenged you to a tictactoe match. Do you accept?`, components: [row]});
    const choiceCollector = new Discord.InteractionCollector(bot, {message: choicemsg, type: "MESSAGE_COMPONENT", time: 30000});
    choiceCollector.on("collect", async (interaction)=>{
        if (!(!interaction.user.bot && (interaction.user.id == message.author.id || interaction.user.id == mention.user.id))) return interaction.reply({content: "You cannot use this menu.", ephemeral: true})
        if (!(!interaction.user.bot && interaction.user.id == mention.user.id)) return interaction.reply({content: "You cannot reply to this.", ephemeral: true})
        
        if (interaction.customId == "yes") {
            interaction.reply({content: "Game is starting!", ephemeral: true})
            choiceCollector.stop(`${message.author}, ${mention} has accepted to play a tictactoe match with you.`);
            
            let ran = Math.random();
            let player1 = ran>=0.5?message.author:mention.user;
            let player2 = ran<0.5?message.author:mention.user;
            let activeplayer = player1;
            let a1 = new Discord.MessageButton()
                .setCustomId("a1")
                .setLabel(" ")
                .setStyle("SECONDARY");
            let a2 = new Discord.MessageButton()
                .setCustomId("a2")
                .setLabel(" ")
                .setStyle("SECONDARY");
            let a3 = new Discord.MessageButton()
                .setCustomId("a3")
                .setLabel(" ")
                .setStyle("SECONDARY");
            let gameRow1 = new Discord.MessageActionRow().addComponents(a1, a2, a3)
            let b1 = new Discord.MessageButton()
                .setCustomId("b1")
                .setLabel(" ")
                .setStyle("SECONDARY");
            let b2 = new Discord.MessageButton()
                .setCustomId("b2")
                .setLabel(" ")
                .setStyle("SECONDARY");
            let b3 = new Discord.MessageButton()
                .setCustomId("b3")
                .setLabel(" ")
                .setStyle("SECONDARY");
            let gameRow2 = new Discord.MessageActionRow().addComponents(b1, b2, b3)
            let c1 = new Discord.MessageButton()
                .setCustomId("c1")
                .setLabel(" ")
                .setStyle("SECONDARY");
            let c2 = new Discord.MessageButton()
                .setCustomId("c2")
                .setLabel(" ")
                .setStyle("SECONDARY");
            let c3 = new Discord.MessageButton()
                .setCustomId("c3")
                .setLabel(" ")
                .setStyle("SECONDARY");
            let gameRow3 = new Discord.MessageActionRow().addComponents(c1, c2, c3)
            let symbol = {
                player1: "❌",
                player2: '⭕'
            }
            let gamePieces = [
                [a1.emoji, a2.emoji, a3.emoji], 
                [b1.emoji, b2.emoji, b3.emoji], 
                [c1.emoji, c2.emoji, c3.emoji]
            ]
            let gameMsg = await interaction.channel.send({content: `**${player1.username} vs ${player2.username}**\n\n${activeplayer.username}'s turn (${symbol.player1})`, components: [gameRow1, gameRow2, gameRow3]})
            const gameCollector = new Discord.InteractionCollector(bot, {message: gameMsg, type: "MESSAGE_COMPONENT", idle: 30000});
            let c = 0;
            gameCollector.on("collect", async (interaction)=>{
                if (!(!interaction.user.bot && (interaction.user.id == message.author.id || interaction.user.id == mention.user.id))) return interaction.reply({content: "You cannot pla this game.", ephemeral: true})
                if (!(!interaction.user.bot && interaction.user.id == activeplayer.id)) return interaction.reply({content: "It's not your turn.", ephemeral: true})
                let btn = interaction.customId;
                let btnNo = btn.substring(1,2);
                let actp = activeplayer == player1 ? "player1" : "player2";
                c++;
                switch(btn.substring(0,1)) {
                    case "a":
                        if (btnNo == 1)
                            btn = a1;
                        else if (btnNo == 2)
                            btn = a2;
                        else if (btnNo == 3)
                            btn = a3;
                        break;
                    case "b":
                        if (btnNo == 1)
                            btn = b1;
                        else if (btnNo == 2)
                            btn = b2;
                        else if (btnNo == 3)
                            btn = b3;
                        break;
                    case "c":
                        if (btnNo == 1)
                            btn = c1;
                        else if (btnNo == 2)
                            btn = c2;
                        else if (btnNo == 3)
                            btn = c3;
                            
                        break;
                }
                btn.setEmoji(`${symbol[actp]}`).setDisabled(true).setStyle(activeplayer==player1?"PRIMARY":"DANGER");
                gamePieces = [
                    [a1.emoji, a2.emoji, a3.emoji], 
                    [b1.emoji, b2.emoji, b3.emoji], 
                    [c1.emoji, c2.emoji, c3.emoji]
                ]
                let win = await checkWin(gamePieces, btn);
                if (win) {
                    interaction.reply({content: "You've won!", ephemeral: true})
                    return gameCollector.stop("win")
                }
                else {
                    if (c == 9) {
                        interaction.reply({content: "It's a draw", ephemeral: true})
                        return gameCollector.stop("draw");       
                    }
                }
                gameRow1 = new Discord.MessageActionRow().addComponents(a1, a2, a3)
                gameRow2 = new Discord.MessageActionRow().addComponents(b1, b2, b3)
                gameRow3 = new Discord.MessageActionRow().addComponents(c1, c2, c3)
                activeplayer = activeplayer==player1?player2:player1;
                actp = activeplayer == player1 ? "player1" : "player2";
                interaction.update({content: `**${player1.username} vs ${player2.username}**\n\n${activeplayer.username}'s turn (${symbol[actp]})`, components: [gameRow1, gameRow2, gameRow3]})
                
            })
            gameCollector.on("end", (collected, reason)=>{
                a1.setDisabled(true);
                a2.setDisabled(true);
                a3.setDisabled(true);
                b1.setDisabled(true);
                b2.setDisabled(true);
                b3.setDisabled(true);
                c1.setDisabled(true);
                c2.setDisabled(true);
                c3.setDisabled(true);
                gameRow1 = new Discord.MessageActionRow().addComponents(a1, a2, a3)
                gameRow2 = new Discord.MessageActionRow().addComponents(b1, b2, b3)
                gameRow3 = new Discord.MessageActionRow().addComponents(c1, c2, c3)
                gameMsg.edit({content: `${reason == "idle"? `**${player1.username} vs ${player2.username}**\n\nEnded due to inactivity`: reason == "win"? `**${player1.username} vs ${player2.username}**\n\nWinner: ${activeplayer.username}` :`**${player1.username} vs ${player2.username}**\n\n The game ended in a draw :/`}`, components: [gameRow1, gameRow2, gameRow3]})
            })
        }
        else {
            interaction.reply({content: "You denied to play", ephemeral: true})
            choiceCollector.stop(`${message.author}, ${mention} has denied to play a tictactoe match with you.`);
        }
    })
    
    choiceCollector.on("end", async (collected, reason)=>{
        yes.setDisabled(true);
        no.setDisabled(true);
        choice = new Discord.MessageActionRow().addComponents(yes, no);
        choicemsg.edit({content: reason == "idle"?choicemsg.content:reason, components: [choice]});
        if (reason == "idle") return choicemsg.reply("Timed out after 30 seconds of inactivity.");
    })        
    }
}
