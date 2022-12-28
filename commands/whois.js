exports.run = async (bot, message, args) => {

    const csvfuncs = require("../csvfuncs")
    const justfuncs = require("../justfuncs")
    const { MessageEmbed } = require('discord.js');

    let argumentGuideEmbed = await justfuncs.popupEmbed({
        title: "Provide arguments, please!",
        description: "Examples: ```.whois @Doog``` ```.whois doog``` ```.whois 735322421862727760```"
    })

    // Find the discord user being referred to or return that the user was not found.
    let msgargs = message.content.split(' ')
    if (msgargs.length <= 1) return message.reply({embeds: [argumentGuideEmbed]});
    let target = message.mentions.members.first() || [...(!msgargs[1] ? null : await message.guild.members.fetch({query: String(msgargs[1]), limit: 1}))?.values()][0] || await message.guild.members.cache.get(String(msgargs[1]));
    let userNotExistsEmbed = await justfuncs.popupEmbed({
        title: "I couldn't find that user!",
        description: ` \`\`\`Tried searching for ${msgargs[1]} \`\`\` `
    });
    if (!target) return message.reply({embeds: [userNotExistsEmbed]});
    const discordid = target.user.id

    // Find out if that discord user has registered in the CSV file.
    let user = await csvfuncs.getFiltered( (user) => { if (user.discordid.trim() == discordid) return user } );
    let userNotFoundEmbed = await justfuncs.popupEmbed({
        title: "That user does not exist in my database!",
        description: ` \`\`\`Tried searching for <@${discordid}> or ${discordid} \`\`\` (They may not have verified themselves yet)`
    });
    if (!user || !user.length) return message.reply({embeds: [userNotFoundEmbed]});

    // Gather info on the user
    user = user[0]
    let infoEmbed = new MessageEmbed()
    .setColor('DARK_AQUA')
    .setTitle(`${user.name} (${user.bn})`)
    .setDescription(`This account belongs to *${user.name}* ${user.class != "-" ? ("of class *" + user.class + "*") : ""}, BN *${user.bn}* and Discord ID <@${user.discordid}> or ${user.discordid}.`)
    .addField("Sector", user.club.charAt(0).toUpperCase() + user.club.slice(1))
    .addField("Email", user.email)
    .addField("Role to grant", "<@&" + user.roletogrant + ">")
    .addField("Additional Information", user.additional || "-")
    .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
    .setFooter("The DPSBN Tech Club")
    .setTimestamp(new Date())

    try { message.channel.send({embeds: [infoEmbed]}) } catch (err) { console.log(err); message.reply('oh nyo something happened. doog san pls check.') }

}