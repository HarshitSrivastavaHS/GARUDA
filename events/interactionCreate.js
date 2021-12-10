module.exports = {
  name: "interactionCreate",
  async execute(interaction){
    let bot = interaction.client;

    if (!interaction.isCommand()) return;

    bot.commands.get(interaction.commandName.toLowerCase()).command.slashExecute(interaction);
  }
}
