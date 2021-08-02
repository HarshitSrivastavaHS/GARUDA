module.exports = {
    name: 'ban',
    type: 'moderation',
    usage: '&{prefix}ban <user\'s @>',
    description: 'kicks and bans a user out of the server',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    async execute(message, args, bot, Discord, prefix) {
        if(!message.member.permissions.has("BAN_MEMBERS")) {
            message.channel.send("You don't have the required permissions.");
            return;
        }
        const mentionMember = message.mentions.members.first()?message.mentions.members.first().id:undefined || args[0];

        if (args.length === 0 || mentionMember === undefined) {
            message.reply(`Invalid Syntax! \`\`\`%ban <@user|id>\`\`\``)
            return;
        }
        const srole = message.member.roles.highest.position;
        const rrole = await message.guild.members.fetch(mentionMember).then(m=>m.roles.highest.position).catch(e=>-1);
        
        if (srole>rrole || message.guild.owner.id == message.member.id) {
            message.guild.members.ban(mentionMember).then(user=>{
                message.channel.send(`Successfully banned \`${user.username || user.id || user}\` from ${message.guild.name}`);
            }).catch(err=>{
                message.channel.send(`Could not ban that user\n\`${err}\``);
            })
        }
        else {
            message.reply("You cannot ban someone with a higher or equal role as your.");
        }
    }
}
