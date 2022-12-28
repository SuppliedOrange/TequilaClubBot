exports.run = async (bot, message, args) => {

    const csvfuncs = require("../csvfuncs")
    const { MessageEmbed } = require('discord.js');

    let userStrings = await csvfuncs.joinstatus();
    let missingUserCount = userStrings.missingUsers.length;
    let presentUserCount = userStrings.presentUsers.length;

    // We count everyone with a tick mark
    let confirmedAttendingCount = (await csvfuncs.getFiltered( (user) => user.confirmation == '✅'  )).length;


    let statusEmbed = new MessageEmbed()
    .setColor('DARK_AQUA')
    .setTitle("how many boys have we pulled?")
    .addField("Total", (missingUserCount + presentUserCount).toString() )
    .addField("Definitely attending", confirmedAttendingCount.toString() )
    .setFooter("boy do i love the taste of a gun barrel")
    .setTimestamp(new Date())

    try { message.channel.send({embeds: [statusEmbed]}) } catch (err) { console.log(err); message.reply('oh nyo something happened. doog san pls check.') }

}