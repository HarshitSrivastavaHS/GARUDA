module.exports = {
    name: 'kick',
    type: 'moderation',
    description: 'Kicks a user out of the server',
    aliases: [],
    usage:"&{prefix}kick @user",
    permissions: ['SEND_MESSAGES', 'KICK_MEMBERS'],
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
        if(!message.member.permissions.has("KICK_MEMBERS")) {
            message.channel.send("You don't have the required permissions.");
            return;
        }
        const mentionMember = message.mentions.members.first();

        if (args.length === 0 || mentionMember === undefined) {
            message.reply(`Invalid Syntax! \`\`\`%kick @mention\`\`\``)
            return;
        }
        const srole = message.member.roles.highest.position;
        const rrole = mentionMember.roles.highest.position;
        const brole = message.guild.me.roles.highest.position;
        
        if (srole>rrole) {
            if (brole>rrole) {
                mentionMember.kick();
                message.channel.send(`${mentionMember} was kicked by ${message.member}.`);
            }
            else {
                message.reply(":cry: I cannot kick that user.");
            }
        }
        else {
            message.reply(":broken_heart: You cannot kick someone with a higher or equal role as your.");
        }
    }
}
