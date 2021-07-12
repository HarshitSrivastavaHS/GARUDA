const mongo = require(`../mongo`);
const serverConfig = require('../Schemas/server-config');

module.exports = {
    name: 'membercount',
    type: 'info',
    usage: '&{prefix}membercount',
    description: 'shows the total member of people in the server with member goals',
    aliases: ["members", "goal"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        if (args.length!=0) {
            if (args[0] == "goalset") {
                if (args[1]&&Number.isInteger(parseInt(args[1)])) {
                    message.channel.send(`Server members goal (humans) set to ${args[1]}`);
                    await mongo().then(async (mongoose)=>{
              
                        await serverConfig.findOneAndUpdate({
                              _id: message.guild.id
                            },{
                                _id: message.guild.id,
                                goal: args[1],
                            },{
                                upsert: true
                            })
                    });
                    let result = bot.serverConfig.get(message.guild.id);
                    bot.serverConfig.set(message.guild.id, {
                        prefix: result.prefix,
                        suggestion: result.suggestion,
                        welcome: result.welcome,
                        leave: result.leave,
                        modLog: result.modLog,
                        ghost: result.ghost,
                        autoRole: result.autoRole,
                        goal: args[1],
                })    
                }
                else {
                    message.reply(`Please enter a number only.`);
                }
            }
            else if (args[0] == "goalremove") {
                message.channel.send(`Server members goal (humans) cleared.`);
                await mongo().then(async (mongoose)=>{
            
                    await serverConfig.findOneAndUpdate({
                            _id: message.guild.id
                        },{
                            _id: message.guild.id,
                            goal: undefined,
                        },{
                            upsert: true
                        })
                });
                let result = bot.serverConfig.get(message.guild.id);
                bot.serverConfig.set(message.guild.id, {
                    prefix: result.prefix,
                    suggestion: result.suggestion,
                    welcome: result.welcome,
                    leave: result.leave,
                    modLog: result.modLog,
                    ghost: result.ghost,
                    autoRole: result.autoRole,
                    goal: undefined,
                })    
            }
            else {
                message.channel.send(`Invalid subcommand. To set member goal, please run \`${prefix}membercount goalset <number>\``)
            }
        }
        else {
            let goal = bot.serverConfig.get(message.guild.id)?bot.serverConfig.get(message.guild.id).goal:undefined;
            let humans = message.guild.members.cache.filter(m=>!m.user.bot).size;
            let bots = message.guild.members.cache.filter(m=>m.user.bot).size;
            let goaltext = `${goal}\n${humans<goal?`Humans left to reach goal: ${goal-human}`:`Human Goal Reached!`}`;
            await message.guild.members.fetch();
            let emb = new Discord.MessageEmbed()
            .setTitle(`Member Count`)
            .setColor("#FFA500")
            .setThumbnail(message.guild.icon?message.guild.iconURL({dynamic: true}):undefined)
            .setDescription(`Total members: ${message.guild.members.cache.size}\nTotal Humans: ${humans}\nTotal bots: ${bots}\n\nHuman Goal: ${goal?goaltext:`To set goal, use ${prefix}membercount goalset <number>`}`)
            .setTimestamp();
            message.channel.send(emb);
        }
    }
}
