const fs = require("fs")
module.exports = {
    name: "eval",
    usage: '&{prefix}eval',
    description: '¯\_(ツ)_/¯',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        if (message.author.id != "451693463742840842") return message.reply("Not a public command.");
    function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
    try {
         const code = args.join(" ");
      	let evaled = eval(code);
	if (evaled instanceof Promise || (Boolean(evaled) && typeof evaled.then === 'function' && typeof evaled.catch === 'function')) evaled = await evaled;
      	if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, { depth: 0 });

evaled = Discord.Formatters.codeBlock("md", clean(evaled))
      message.channel.send({ content: evaled, split: true }).catch(err=>{console.log(evaled); message.channel.send("Results were logged in the console.");})
    } catch (err) {
      return message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    } 
    
    }
}
