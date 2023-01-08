exports.run = async (bot, message, args) => {

    const csvfuncs = require("../csvfuncs")
    const justfuncs = require("../justfuncs")

    let argumentGuideEmbed = await justfuncs.popupEmbed({
        title: "hi i would like one cup of arguments please.",
        description: "Examples:```.unconfirm 4089```(This unconfirms BN/4089)"
    })

    let noPermsEmbed = await justfuncs.popupEmbed({
        title: "Sorry pal",
        description: "Only the valorant tournament mods may use this command"
    })

    // Find the discord user being referred to or return that the user was not found.
    let msgargs = message.content.split(' ')
    if (msgargs.length <= 1) return message.reply({embeds: [argumentGuideEmbed]});
    const bn = msgargs[1].replace(/\D/g,''); // Convert the BN number to numeric-only format (BN/4089 -> 4089)

    if (!message.member.roles.cache.find(r => r.name === "VALORANT Tournament Mods")) return message.reply({embeds: [noPermsEmbed]});

    let allUsers = await csvfuncs.readcsvfile();

    let userToChange = allUsers.filter( user => user.bn.replace(/\D/g,'') == bn ) // Find the user by the BN number provided
    let userNotFoundEmbed = await justfuncs.popupEmbed({
        title: "Couldn't find BN/" + bn + "!",
        description: `Did you enter the BN number correctly?`,
        fields: null
    });
    if (!userToChange.length) return message.reply({embeds: [userNotFoundEmbed]})
    else userToChange = userToChange[0]

    await csvfuncs.updateConfirmation(bn, "❔")

    allUsers = await csvfuncs.readcsvfile(); // Update the user list, get changedUser
    let changedUser = allUsers.filter( user => user.bn.replace(/\D/g,'') == bn )[0];

    let changeResultsEmbed = await justfuncs.confirmationEmbed({
        action: "Unconfirmed",
        description: `You have set *${changedUser.name}*'s status to unconfirmed because you aren't sure they'll be attending the event.`,
        changedUser: changedUser,
        userToChange: userToChange,
        message: message
    })

    try { message.channel.send({embeds: [changeResultsEmbed]}) } catch (err) { console.log(err); message.reply('oh nyo something happened. doog san pls check.') }

}
