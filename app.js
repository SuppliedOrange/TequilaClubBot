require('dotenv').config();
const [ token, apikey, prefix ] = [process.env.TOKEN,process.env.API_KEY, "."]

const csvfuncs = require("./csvfuncs")
const justfuncs = require("./justfuncs")

const { Client, Intents, Collection } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });
bot.options.ws.properties.$browser = "Discord Android";

const fs = require("fs");

bot.commands = new Collection();
bot.slash = new Collection();
bot.apikey = apikey;

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'))
for (const file of commandFiles) {
    const props = require(`./commands/${file}`)
    console.log(`${file} loaded`)
    bot.commands.set(file, props)
}

// Load Command files from commands folder
const commandSubFolders = fs.readdirSync('./commands/').filter(f => !f.endsWith('.js'))
commandSubFolders.forEach(folder => {
    const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(f => f.endsWith('.js'))
    for (const file of commandFiles) {
        const props = require(`./commands/${folder}/${file}`)
        console.log(`${file} loaded from ${folder}`)
        bot.commands.set(props.help.name, props)
    }
});

// Load Event files from events folder
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if(event.once) {
        bot.once(event.name, (...args) => event.execute(...args, bot))
    } else {
        bot.on(event.name, (...args) => event.execute(...args, bot))
    }
}

bot.on("messageCreate", async message => {
    if(message.author.bot) return;

    const prefixes = ['.','+'];
    if (!prefixes.includes(message.content[0])) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    //Get the command from the commands collection and then if the command is found run the command file
    let cmdfile = `${cmd.slice(prefix.length)}.js`
    if (commandFiles.includes(cmdfile)) {
        cmdfile = require(`./commands/${cmdfile}`)
        cmdfile.run(bot,message,args);
    }

    // Verification channel functions
    if (message.channel.id == '1039940000223088741') try { await verify(message) }
    catch (err) { if (!err.toString().split(' ').includes("undefined")) message.channel.send("Oops, something happened and I couldn't verify that message. Call Doog for help."); }
});

async function verify (message) {
    
    let invalidCodeEmbed = await justfuncs.elongatedEmbed({
        title: "Invalid Code",
        description: "\nMake sure you copy and paste the exact code you recieved in your email.\n\n",
        fields: [ {name: "Still need help?", value: "Shoot <@735322421862727760> a message or mail *dpsbn.techclub@gmail.com* and we'll get back to you as soon as we can.", inline: false} ]
    })

    if (message.content.trim().split(' ').length > 1) try { return await justfuncs.alertAndKill(await message.reply({embeds: [invalidCodeEmbed]}), message, false); } catch (err) { return };
    const code = message.content.trim();
    
    let user = await csvfuncs.verifyUser(code);
    if (!user || !user.length || !user[0]) try { return await justfuncs.alertAndKill(await message.reply({embeds: [invalidCodeEmbed]}), message, false); } catch (err) { return };
    // Is user a valid js object || Does user even have content || Is the first item of user null?

    user = user[0];
    let usedCodeEmbed = await justfuncs.popupEmbed({
            title: "That code has already been used.",
            description: `The code you entered was already used by <@${user?.discordid}>.\nIt was meant for *${user?.bn}* of the *${user?.club} club*.\n\nIf you feel that someone else has used your code, let us know ASAP.\n⚠**dpsbn.techclub@gmail.com**⚠`
        })
    if (user?.discordid != '-' && user?.discordid != message.author.id) try { return await justfuncs.alertAndKill(await message.reply({embeds: [usedCodeEmbed]}), message, false); } catch (err) { return };

    csvfuncs.grantAccess(user.code, message.author.id, message);
}   

// Token from .env
bot.login(token);
