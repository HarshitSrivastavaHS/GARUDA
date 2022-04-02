const figlet = require("util").promisify(require("figlet"));
const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
async function main(text) {
  let banner = (await figlet(text)).substring(0,1900);
  banner = Discord.Formatters.codeBlock("md", banner);
  return banner;
}
module.exports = {
    name: 'ascii',
    usage: '&{prefix}banner <text>',
    description: 'types that text in banner form',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
      if (args.length==0) return message.channel.send("Please enter the text.");
      message.channel.send(await main(args.join(" ")));
    },
    slash: new SlashCommandBuilder()
      .setName('ascii')
      .setDescription('Types that text in cool looking form')
      .addStringOption(option =>
	    	option.setName('text')
			    .setDescription('Your Text')
          .setRequired(true)),
    async slashExecute(interaction) {
      let text = interaction.options.getString("text");
      interaction.reply(await main(text));
    }
}
