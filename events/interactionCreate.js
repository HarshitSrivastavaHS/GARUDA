module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        let bot = interaction.client;

        if (!interaction.isCommand()) return;

        bot.commands.get(interaction.commandName.toLowerCase()).command.slashExecute(interaction);
        const partners = [
            {
                name: "Dumbot",
                linkName: "Bot Invite",
                link: "https://discord.com/oauth2/authorize?client_id=870239976690970625&permissions=0&scope=bot"
            }
        ];
        if (Math.random() * 50 == 2) {
            const partnershipEmbed = new Discord.MessageEmbed()
                .setColor("#e52165")
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                .setTitle("Our Partners")
                .setFooter("Bot by TechAllByHarshit#1503")
                .setTimestamp();
            for (let partner of partners) {
                partnershipEmbed.addField(`${partner.name}`, `[${partner.linkName}](${partner.link})`);
            }
            message.reply({ embeds: [partnershipEmbed] });
        }
    }
}