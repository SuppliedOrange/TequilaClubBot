exports.run = async (bot, message, args) => {

    const csvfuncs = require("../csvfuncs")
    const { MessageEmbed } = require('discord.js');

    // So I made this really cool, elaborate, oddly specific and poorly documented function called joinstatus
    /*
    Returns a long string with each user formatted in the way we want. We've provided an anonymous function that takes a user and
    index for each user in 'missing' or 'present' category (that's up to you to choose) and sends back a string. All of these strings
    are collected, concatenated and returned.
    If you don't provide arguements, you'll get back an array of user objects (with the keys being all the headers in allowedUser.csv)
    */

    let userStrings = await csvfuncs.joinstatus({
        missing: (user, index) => `\n**${index + 1}:** ${user.name} / ${user.email} / ${user.confirmation}\n`
    });
    let missingUserString = userStrings.missingUsers;

    let statusEmbed = new MessageEmbed()
    .setColor('DARK_AQUA')
    .setTitle("Users that haven't joined yet")
    .setDescription(
        `\n${missingUserString || "Everybody's joined the server. Let's get this party started! Woohoo!"}\n`
    )
    .setFooter("runs on doogscript")
    .setTimestamp(new Date())

    try { message.channel.send({embeds: [statusEmbed]}) } catch (err) { console.log(err); message.reply('oh nyo something happened. doog san pls check.') }

}
