const fs = require("fs")
module.exports = {
    name: "reload",
    usage: '&{prefix}reload <category> <command>',
    description: 'reloads a command(s)',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        if (message.author.id != "451693463742840842") return message.reply("Not a public command.");

        if (!args[0]) return message.reply("You must specify the category.")
        if (!args[1]) return message.reply("You must specify the command.")

        let category = args[0].toLowerCase();
        let command = args[1].toLowerCase();

        try {
            delete require.cache[require.resolve(`../../commands/${category}/${command}.js`)];
            bot.commands.delete(command);

            const pull = require(`../../commands/${category}/${command}.js`);
            bot.commands.set(pull.name, {category, pull, aliases: pull.aliases});
            return message.reply(`Command \`${command}\` from \`${category}\` reloaded successfully.`);
        } catch (error) {
            return message.reply(`Error reloading \`\`\`js\n${error}\`\`\``);
        }
//         if (!args) return message.reply("Which command do i have to reload?");
//         if (args){
//             fs.readdir("./commands", (err, categories)=>{
//                 if (err) return message.reply(`Error:\`\`\`js\n${err}\`\`\``)
//                 if (!args[0]) return message.reply("Please type the name of the category")
//                 if (!categories.includes(args[0].toLowerCase())) return message.reply(`Category \`${args[0]}\` not found`);
//                 let index = categories.indexOf(args[0]);
//                 let cmd;
//                 if (!args[1]) {
//                     cmd = fs.readdirSync(`./commands/${categories[index]}/`).filter(f=>f.endsWith(".js"))
//                     let str = "";
//                     for (let command of cmd) {
//                         command = require(`./../../commands/${categories[index]}/${command}`)
//                         bot.commands.delete(command.name)
//                         let cat = categories[index];
//                         bot.commands.set(command.name, {cat, command, aliases: command.aliases})
//                         str += `${command.name}\n`
//                     }
//                     message.reply(`Category \`${args[0]}\` reloaded successfully\`\`\`js\n${str}\`\`\``);
//                 }
//                 else {
//                     cmd = fs.readdirSync(`./commands/${categories[index]}/`).filter(f=>f == args[1].toLowerCase());
//                     if (!cmd) return message.reply(`Command \`${args[1]}\` not found in category: \`${args[0]}\``);
//                         command = require(`./../../commands/${categories[index]}/${cmd}`);
//                         bot.commands.delete(command.name)
//                         let cat = categories[index];
//                         bot.commands.set(command.name, {cat, command, aliases: command.aliases});
//                         message.reply(`Command \`${args[1]}\` reloaded successfully`);
//                 }
//             });
//         }
    }
}
