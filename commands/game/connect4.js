module.exports = {
    name: 'connect4',
    usage: `&{prefix}connect4 <user's @>`,
    description: 'play connect four with someone',
    aliases: ["c4", "connectfour"],
    permissions: ['SEND_MESSAGES', 'ADD_REACTIONS'],
    async execute(message, args, bot, Discord, prefix) {
        let mention = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first(): undefined;
        if (!mention) return message.reply("You forgot to tag your opponent :/");
        if (mention.id == message.author.id) return message.reply("You cannot play with yourself :/");
        if (mention.bot) return message.reply(`You cannot play with a bot.`);
        let yes = new Discord.MessageButton()
            .setCustomId("accept")
            .setLabel("Accept")
            .setStyle("SUCCESS")
        let no = new Discord.MessageButton()
            .setCustomId("reject")
            .setLabel("Decline")
            .setStyle("DANGER")
        let choice = new Discord.MessageActionRow().addComponents(yes, no);
        let choicemsg = await message.channel.send({content: `${mention}, ${message.author} has challenged you to a connect four match! Do you accept?`, components: [choice]})
        
        const choiceCollector = new Discord.InteractionCollector(bot, {message: choicemsg, type: "MESSAGE_COMPONENT", idle: 30000});

        choiceCollector.on("collect", async (interaction)=>{
            if (!(!interaction.user.bot && (interaction.user.id == message.author.id || interaction.user.id == mention.user.id))) return interaction.reply({content: "You cannot play this game.", ephemeral: true})
            if (!(!interaction.user.bot && interaction.user.id == mention.user.id)) return interaction.reply({content: "You cannot reply to this.", ephemeral: true})
            choiceCollector.stop();
            if (interaction.customId == "accept") {
                interaction.reply({content: "Game is starting!", ephemeral: true})
                choicemsg.edit({content: `${message.author}, ${mention} has accepted to play a connect4 match with you.`})
                let ran = Math.random();
          let player1 = ran>=0.5?message.author:mention.user;
          let player2 = ran<0.5?message.author:mention.user;
        let pieces = {
        "player1": "🟡",
        "player2": "🟢",
        "empty": "◼️",
        "player1Win": "💛",
        "player2Win": "💚"
        }
        let count = 0;
        let movesCount = 0;
        let gameboard = [];
        for (let r = 1; r<=6; r++) {
        let row = [];
        for (let c = 1; c<=7; c++) {
        row.push(pieces.empty);
        count++;
        }
        gameboard.push(row);
        }

        let activeplayer = player1;
        let btn1 =  new Discord.MessageButton()
            .setCustomId("0")
            .setLabel("1")
            .setStyle("PRIMARY")
        let btn2 = new Discord.MessageButton()
            .setCustomId("1")
            .setLabel("2")
            .setStyle("PRIMARY") 
        let btn3 = new Discord.MessageButton()
            .setCustomId("2")
            .setLabel("3")
            .setStyle("PRIMARY") 
        let btn4 = new Discord.MessageButton()
            .setCustomId("3")
            .setLabel("4")
            .setStyle("PRIMARY")
        let btn5 = new Discord.MessageButton()
            .setCustomId("4")
            .setLabel("5")
            .setStyle("PRIMARY")
        let btn6 = new Discord.MessageButton()
            .setCustomId("5")
            .setLabel("6")
            .setStyle("PRIMARY")
        let btn7 = new Discord.MessageButton()
                .setCustomId("6")
                .setLabel("7")
                .setStyle("PRIMARY")
        let row1 = new Discord.MessageActionRow().addComponents(btn1, btn2, btn3, btn4, btn5);
        let row2 = new Discord.MessageActionRow().addComponents(btn6, btn7);
        let msg = await message.channel.send({content: `${activeplayer}'s turn\n${gameboard.map(r=>r.join("")).join("\n")}`, components: [row1, row2]}); 
        const collector = new Discord.InteractionCollector(bot, {message: msg, type: "MESSAGE_COMPONENT", idle: 30000});
        
        let checkWin = ((row, column)=>{
            row = parseInt(row);
            column = parseInt(column);
            let cell = gameboard[row][column];
            let winningCells = [[row, column]]; 
            //check horizontally
            let rowToCheck = row;
            let colToCheck = column-1;
            while (colToCheck >=0) {
                const cellToCheck = gameboard[rowToCheck][colToCheck];
                if (cellToCheck == cell) {
                    winningCells.push([rowToCheck, colToCheck]);
                }
                else {
                    break;
                }
                colToCheck--;
            }
            colToCheck = column+1;
            while (colToCheck < 7) {
                const cellToCheck = gameboard[rowToCheck][colToCheck];
                
                if (cellToCheck == cell) {
                    winningCells.push([rowToCheck, colToCheck]);
                }
                else {
                    break;
                }
                colToCheck++;
            }
            if (winningCells.length >= 4) {
                for (cell of winningCells) {
                    gameboard[cell[0]][cell[1]] = activeplayer==player1?pieces.player1Win:pieces.player2Win;
                }
                return activeplayer;
            }
            //check Vertically
            winningCells = [[row, column]];
            rowToCheck = row-1;
            colToCheck = column;
            while (rowToCheck >=0) {
                const cellToCheck = gameboard[rowToCheck][colToCheck];
                if (cellToCheck == cell) {
                    winningCells.push([rowToCheck, colToCheck]);
                }
                else {
                    break;
                }
                rowToCheck--;
            }
            rowToCheck = row+1;
            while (rowToCheck < 6) {
                const cellToCheck = gameboard[rowToCheck][colToCheck];
                
                if (cellToCheck == cell) {
                    winningCells.push([rowToCheck, colToCheck]);
                }
                else {
                    break;
                }
                rowToCheck++;
            }
            if (winningCells.length >= 4) {
                for (cell of winningCells) {
                    gameboard[cell[0]][cell[1]] = activeplayer==player1?pieces.player1Win:pieces.player2Win;
                }
                return activeplayer;
            }
            //check right diagonally 
            winningCells = [[row, column]];
            rowToCheck = row+1;
            colToCheck = column-1;
            while (colToCheck >=0 && rowToCheck < 6) {
                const cellToCheck = gameboard[rowToCheck][colToCheck];
                if (cellToCheck == cell) {
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
            while (rowToCheck < 6) {
                const cellToCheck = gameboard[rowToCheck][colToCheck];
                
                if (cellToCheck == cell) {
                    winningCells.push([rowToCheck, colToCheck]);
                }
                else {
                    break;
                }
                rowToCheck++;
                colToCheck--;
            }
            if (winningCells.length >= 4) {
                for (cell of winningCells) {
                    gameboard[cell[0]][cell[1]] = activeplayer==player1?pieces.player1Win:pieces.player2Win;
                }
                return activeplayer;
            }
            //check left diagonally 
            winningCells = [[row, column]];
            rowToCheck = row-1;
            colToCheck = column-1;
            while (colToCheck >=0 && rowToCheck < 6) {
                const cellToCheck = gameboard[rowToCheck][colToCheck];
                if (cellToCheck == cell) {
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
            while (rowToCheck < 6) {
                const cellToCheck = gameboard[rowToCheck][colToCheck];
                
                if (cellToCheck == cell) {
                    winningCells.push([rowToCheck, colToCheck]);
                }
                else {
                    break;
                }
                rowToCheck++;
                colToCheck++;
            }
            if (winningCells.length >= 4) {
                for (cell of winningCells) {
                    gameboard[cell[0]][cell[1]] = activeplayer==player1?pieces.player1Win:pieces.player2Win;
                }
                return activeplayer;
            }
            return undefined;
        })

        collector.on("collect", (interaction)=>{
            if (!(!interaction.user.bot && (interaction.user.id == player1.id || interaction.user.id == player2.id))) return interaction.reply({content: "You cannot play this game.", ephemeral: true})
            if (!(!interaction.user.bot && interaction.user.id == activeplayer.id)) return interaction.reply({content: "It isn't your turn", ephemeral: true})
            let column = interaction.customId;
            for (let i = 5; i>=0; i--) {
                if (gameboard[i][column]== pieces.empty) {
                    gameboard[i][column] = interaction.user.id==player1.id?pieces.player1:pieces.player2;
                    if (i==0) {
                        if (btn1.customId == interaction.customId) btn1.setDisabled(true);
                        else if (btn2.customId == interaction.customId) btn2.setDisabled(true);
                        else if (btn3.customId == interaction.customId) btn3.setDisabled(true);
                        else if (btn4.customId == interaction.customId) btn4.setDisabled(true);
                        else if (btn5.customId == interaction.customId) btn5.setDisabled(true);
                        else if (btn6.customId == interaction.customId) btn6.setDisabled(true);
                        else if (btn7.customId == interaction.customId) btn7.setDisabled(true);
                    } 
                    win = checkWin(i, column);
                    if (win) {
                        interaction.reply({content: "You've won!", ephemeral: true});
                        collector.stop("Win")
                    }
                    break;
                }
            }
            
            if (!win) {
                movesCount++;
                if (movesCount < count) {
                row1 = new Discord.MessageActionRow().addComponents(btn1, btn2, btn3, btn4, btn5);
                row2 = new Discord.MessageActionRow().addComponents(btn6, btn7);
                activeplayer = activeplayer==player1?player2:player1;
                msg.edit({content: `${activeplayer}'s turn\n${gameboard.map(r=>r.join("")).join("\n")}`,components: [row1, row2]}); 
                interaction.reply({content: "You played your turn", ephemeral: true});
                }
                else {
                    msg.edit({content: `The game between ${player1} and ${player2} ended in a draw.`,components: [row1, row2]});
                    collector.stop("draw");
                }
            }
        })

        collector.on("end", (collected,reason)=>{
            btn1.setDisabled(true);
            btn2.setDisabled(true);
            btn3.setDisabled(true);
            btn4.setDisabled(true);
            btn5.setDisabled(true);
            btn6.setDisabled(true);
            btn7.setDisabled(true);
            row1 = new Discord.MessageActionRow().addComponents(btn1, btn2, btn3, btn4, btn5);
            row2 = new Discord.MessageActionRow().addComponents(btn6, btn7);
            if (reason=="idle"){
                msg.edit({content: `The game between ${player1} and ${player2} ended due to inactivity.\n${gameboard.map(r=>r.join("")).join("\n")}`,components: [row1, row2]}); 
            }
            else if (reason != "draw"){
                msg.edit({content: `${activeplayer} has won!\n${gameboard.map(r=>r.join("")).join("\n")}`,components: [row1, row2]}); 
            }
        })
            }
            else {
                interaction.reply({content:"Offer declined", ephemeral: true});
                choicemsg.edit({content: `${message.author}, ${mention} declined to play the connect4 game with you.`})
                choiceCollector.stop();
            }
        })

        choiceCollector.on("end", async (collected, reason)=>{
            yes.setDisabled(true);
            no.setDisabled(true);
            choice = new Discord.MessageActionRow().addComponents(yes, no);
            choicemsg.edit({content: choicemsg.content, components: [choice]});
            if (reason == "idle") return choicemsg.reply("Timed out after 30 seconds of inactivity.");
        })
        

        
    }
}
