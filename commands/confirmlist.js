exports.run = async (bot, message, args) => {

    const csvfuncs = require("../csvfuncs")
    const { MessageEmbed } = require('discord.js');

    let userStrings = await csvfuncs.joinstatus({
        missing: (user,index) => `**${index + 1}**. ${user.name} / ${user.bn}\n / ${user.confirmation}\n\n`,
        present: (user,index) => `**${index + 1}**. ${user.name} / <@${user.discordid}>\n / ${user.confirmation}\n / ${user.bn}\n\n`
    });
    let [ missingUserString, presentUserString ] = [ userStrings.missingUsers, userStrings.presentUsers ];

    let confirmListMissingEmbed = new MessageEmbed()
    .setColor('ORANGE')
    .setTitle("Confirmation List | Haven't joined the server")
    .setDescription(
        `\n${missingUserString || "Everybody's joined the server. Let's get this party started!"}`
    )
    .setFooter("girl when im with you there aint no typeerror w me")
    .setTimestamp(new Date())

    let confirmListPresentEmbed = new MessageEmbed()
    .setColor('WHITE')
    .setTitle("Confirmation List | Have joined the server")
    .setDescription(
        `**Users that have joined the server:**\n${presentUserString || "Nobody's.. joined the server? Something's wrong oops."}`
    )
    .setFooter("man i hate chemistry")
    .setTimestamp(new Date())

    try { message.channel.send({embeds: [confirmListMissingEmbed, confirmListPresentEmbed]}) } catch (err) { console.log(err); message.reply('oh nyo something happened. doog san pls check.') }

}

