const mongo = require(`../../mongo`);
const serverConfig = require('../../Schemas/server-config');

const Discord = require("discord.js");

async function help(message, prefix){
    let Main = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({size:4096}))
        .setColor("GREEN")
        .setTitle("Welcomer Help Menu")
        .setDescription(`**Welcomer Configurations**\n\n**Channel:** To configure the welcome channel\n\n**Welcome Message:** To configure the welcome message.`)
        .setTimestamp();
    let Channel = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({size:4096}))
        .setColor("GREEN")
        .setTitle("Welcomer Help Menu")
        .setDescription(`**To set the welcome channel**\n${prefix}welcomer channel set #welcome\n\n**To remove the welcome channel**\n${prefix}welcomer channel unset`)
        .setTimestamp();
    let Message = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({size:4096}))
        .setColor("GREEN")
        .setTitle("Welcomer Help Menu")
        .setDescription(`**To set/change welcome message**\n${prefix}welcomer msg set\n\n**To reset the welcome message**\n${prefix}welcomer msg reset\n\n**To view welcome message**\n${prefix}welcomer msg view\
\n\nNOTE: Use the following keywords for things like username, guild name, etc. (Case Sensitive)\n\`{user}\` To mention the user\n\`{guild}\` To include the server name\n\`{memberCount}\` To get the server total member count\n\`{humanCount}\` To get the total human count`)
        .setTimestamp();
    let embeds = {
        Main, Channel, Message
    }
    let btn1 = new Discord.MessageButton()
            .setCustomId(`0`)
            .setLabel("Main")
            .setStyle("PRIMARY")
            .setDisabled(true)
        let btn2 = new Discord.MessageButton()
            .setCustomId(`01`)
            .setLabel("Channel")
            .setStyle("PRIMARY")
        let btn3 = new Discord.MessageButton()
            .setCustomId(`2`)
            .setLabel("Message")
            .setStyle("PRIMARY")
        let btns = [btn1, btn2, btn3];
        let row = new Discord.MessageActionRow().addComponents(btn1,btn2,btn3);
        let msg = await message.channel.send({embeds: [Main], components: [row]});
        const collector = new Discord.InteractionCollector(message.client, {message: msg, type: "MESSAGE_COMPONENT", idle: 45000});
        collector.on("collect", (interaction)=>{
            if (interaction.user.id != message.author.id) return interaction.reply({content: "You cannot use this menu.", ephemeral: true}); 
            let label;
            for (btn of btns){
                if (btn.customId == interaction.customId){
                    btn.setDisabled(true);
                    label = btn.label;
                    continue;
                }
                btn.setDisabled(false);
            }
            row = new Discord.MessageActionRow().addComponents(btn1,btn2,btn3);
            interaction.update({embeds:[embeds[label]], components: [row]})
            
        })
        collector.on("end", (collected) => {
            for (btn of btns){
                btn.setDisabled(true);
            }
            row = new Discord.MessageActionRow().addComponents(btn1,btn2,btn3);
            msg.edit({embeds: [msg.embeds[0]], components: [row]})
        })
}

module.exports = {
    name: 'welcomer',
    
    description: 'configure the welcomer.',
    usage: '&{prefix}welcomer channel set/unset <#channel>\n&{prefix}welcomer msg view\n&{prefix}welcomer',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        //return message.reply("Command is in development :D");
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("You need manage server pemission to use this command.");
        if (args.length==0) {
            return help(message, prefix);
        } 
        let welcomer = bot.serverConfig.get(message.guild.id).welcomer;
        if (args[0].toLowerCase()=="channel") {
            if (args[1]&&args[1].toLowerCase()=="set") {
                if (args[2]&&args[2].includes(message.mentions.channels.first())) {
                    let channel = message.mentions.channels.first();
                    const msg = await message.channel.send(`Setting ${channel} as the welcome channel.`);
                    try {
                        await channel.send("Successfully set this channel for the welcomer.");
                    }
                    catch (err) {
                        return msg.edit("Missing permissions in that channel");
                    }
                    await mongo().then(async (mongoose)=>{
                
                        await serverConfig.findOneAndUpdate({
                            _id: message.guild.id
                            },{
                                _id: message.guild.id,
                                welcomer: {
                                    channel: channel.id,
                                    message: welcomer?welcomer.message:undefined
                                },
                            },{
                                upsert: true
                            })
                    });
                    msg.edit(`Successfully set the ${channel} as the welcome channel.`);
                    
                }
                else {
                    message.reply("Please mention the welcome channel.")
                }
            }
            else if (args[1]&&args[1].toLowerCase() == "unset") {
                const msg = await message.channel.send(`Disabling the welcomer`);
                await mongo().then(async (mongoose)=>{
                
                    await serverConfig.findOneAndUpdate({
                            _id: message.guild.id
                        },{
                            _id: message.guild.id,
                            welcomer: {
                                channel: undefined,
                                message: welcomer?welcomer.message:undefined
                            },
                        },{
                            upsert: true
                        })
                });
                msg.edit(`Successfully disabled the welcomer`);
                
            }
            else {
                help(message, prefix)
            }
        }
        else if (args[0].toLowerCase()=="msg") {
            if (args[1]&&args[1].toLowerCase()=="set") {
                if (args[2]) {
                    let greeting = args.slice(2,args.length).join(" ");
                    const msg = await message.channel.send(`Setting \`${greeting}\` as the welcome message.`);
                    await mongo().then(async (mongoose)=>{
                
                        await serverConfig.findOneAndUpdate({
                            _id: message.guild.id
                            },{
                                _id: message.guild.id,
                                welcomer: {
                                    channel: welcomer?welcomer.channel:undefined,
                                    message: greeting
                                },
                            },{
                                upsert: true
                            })
                    });
                    msg.edit(`Successfully set the \`${greeting}\` as the welcome message.`);
                    
                }
                else {
                    message.reply("Please mention the welcome channel.")
                }
            }
            else if (args[1]&&args[1].toLowerCase() == "reset") {
                const msg = await message.channel.send(`Removing custom welcome message`);
                await mongo().then(async (mongoose)=>{
                
                    await serverConfig.findOneAndUpdate({
                            _id: message.guild.id
                        },{
                            _id: message.guild.id,
                            welcomer: {
                                channel: welcomer?welcomer.channel:undefined,
                                message: undefined
                            },
                        },{
                            upsert: true
                        })
                });
                msg.edit(`Successfully reset the custom welcome message`);
                
            }
            else if (args[1]&&args[1].toLowerCase() == "view") {
                let greeting = bot.serverConfig.get(message.guild.id)&&bot.serverConfig.get(message.guild.id).welcomer?bot.serverConfig.get(message.guild.id).welcomer.message:undefined;
                if (!greeting) return message.reply("This server has not set any custom greeting message.");
                let emb = new Discord.MessageEmbed()
                .setColor("YELLOW")
                .setTitle("Welcomer greeting message")
                .setDescription(greeting)
                .setFooter(`Requested by ${message.author.tag}`)
                .setTimestamp();
                message.reply({embeds:[emb]});
            }
            else {
                help(message, prefix)
            }
        }
        else {
            help(message, prefix)
        }
    }
}
