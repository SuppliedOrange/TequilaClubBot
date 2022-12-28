const { MessageEmbed } = require('discord.js');

exports.popupEmbed = async (data) => {
    const guideEmbed = new MessageEmbed()
    guideEmbed.setTitle(data.title);
    guideEmbed.setDescription(data.description);
    guideEmbed.setColor('RED')
    guideEmbed.setFooter("The DPSBN Tech Club")
    guideEmbed.setTimestamp(new Date())
    return guideEmbed
}

exports.elongatedEmbed = async (data) => {
    const guideEmbed = new MessageEmbed()
    guideEmbed.setTitle(data.title);
    guideEmbed.setDescription(data.description);
    guideEmbed.setColor('RED')
    guideEmbed.setFooter("The DPSBN Tech Club")
    guideEmbed.setTimestamp(new Date())
    guideEmbed.setImage("https://i.imgur.com/r6uCGyL.png")
    if (data.fields) data.fields.forEach(element => {
        guideEmbed.addField(element.name, element.value, element.inline)
    });
    return guideEmbed
}

exports.confirmationEmbed = async(data) => {
    /*
    data = {
        data.action = "Confirmed",
        data.description = `You have just confirmed that  *${changedUser.name}*  will be attending the event.`,
        data.changedUser = user that you changed
        data.usertochange = user before they were changed
        data.message = message we're referring to
    }
    */
    let changeResultsEmbed = new MessageEmbed()
    .setColor('DARK_AQUA')
    .setTitle(`${data.action} ${data.changedUser.name} (BN/${data.changedUser.bn.replace(/\D/g,'' )})`)
    .setDescription(data.description)
    .addField("Previous confirmation status", `${data.userToChange.confirmation} | ${await this.confirmationParser(data.userToChange.confirmation, 'string')}`)
    .addField("New confirmation status", `${data.changedUser.confirmation} | ${await this.confirmationParser(data.changedUser.confirmation, 'string')}`)
    .addField("To revert it, use", ` \`\`\` ${ await this.confirmationParser( data.userToChange.confirmation, 'function' ) } ${ data.changedUser.bn.replace(/\D/g,'' ) } \`\`\` `)
    .setFooter(`Command initiated by ${data.message.author.username}`)
    .setTimestamp(new Date())
    return changeResultsEmbed;
}

exports.alertAndKill = async (alertMsg, messageToKill, deleteAlert) => {
    try {
        await messageToKill.delete()
        if (deleteAlert){
            await new Promise(r => setTimeout(r, 60000));
            return alertMsg.delete();
        }
    } catch (err) { console.log(err) }
}

exports.confirmationParser = async (confirmation, mode) => {

    let stringconflist = {
        "✅": "Confirmed",
        "❔": "Unconfirmed",
        "❌": "Denied"
    }

    let functionconflist = {
        "✅": ".confirm",
        "❔": ".unconfirm",
        "❌": ".denied"
    }

    confirmation = confirmation.trim()

    let modelist = {
        "string": stringconflist[confirmation],
        "function": functionconflist[confirmation]
    }

    return modelist[mode] ? modelist[mode] : "Invalid Mode/Confirmation"
}