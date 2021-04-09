module.exports = {
    name: 'autorole',
    type: 'admin',
    usage: `&{prefix}autorole <add/remove> <@role or id>`,
    description: 'give roles automatically to the members (human only)',
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
      if (!message.member.permissions.has("MANAGE_SERVER"))
        return message.reply("You don't have the required permissions.");
      if (!(args[0]||args[0].toLowerCase()!="add"||args[0].toLowerCase()!="remove")&&!args[1]) return message.reply(`Invalid Syntax. The following things are required: \nAdd or Remove\nRole mention or id\nUsage: ${prefix}autorole add @members`)
      let subcmd = args[0];
      let role = message.guild.roles.cache.get(args[1]);
      if (!role) return message.reply("Invalid role id or mention.");
      message.channel.send(role.id);
    }
}
