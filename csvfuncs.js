const fs = require('fs'), path = require('path');
const allowedUsersPath = path.normalize(`allowedUsers.csv`);
const stringify = require('csv-stringify/sync').stringify;
const justfuncs = require("./justfuncs")

exports.readcsvfile = async () => {
    const fileContent = fs.readFileSync(allowedUsersPath);

    // Line terminators and delimiters.
    const terminators = ["\r\n", "\r", "\n"], delimiter = ","

    // Check if there is a line terminator in the split word
    const handleTerminator = (word) => {
        let words = null, prequel_word = null, sequel_word = null;
        for (const terminator of terminators) {
            // If there is a terminator, get the word before and after the terminator
            if (word.includes(terminator)) {
                words = word.split(terminator)
            }
            if (words) break;
        }
        if (words) {
            // The word before the terminator goes into the same line, the word after the terminator goes into the next line.
            sequel_word = words.pop()
            prequel_word = words.join(' ')
        }
        return { prequel_word: (prequel_word || word).trim() , sequel_word: sequel_word }
    }

    let fc = fileContent.toString().split(delimiter);
    let rows = new Object()
    let rowNumber = 0

    // Arrange data in the format of [index: [values], index: [values]...]
    for (var split_word of fc) {
        let { prequel_word, sequel_word } = handleTerminator(split_word)
        rows[rowNumber] = rows[rowNumber] || []
        rows[rowNumber].push(prequel_word)
        if (sequel_word) {
            rowNumber++
            rows[rowNumber] = rows[rowNumber] || []
            rows[rowNumber].push(sequel_word)
        }
    }

    // Remove the first index (since that's the header)
    header = rows[0]
    delete rows[0]
    let members = new Array()

    // Convert it to the form of [ {header1: value, header2: value...}, {header1: value, header2: value...}... ]
    for (let i = 0; i < Object.keys(rows).length; i++) {
        let member = Object.assign(...header.map((key, index) => ({ [`${key}`]: rows[i + 1][index] || "-" })));
        members.push( member )
    }

    return members;
}

exports.verifyUser = async (code) => {
    // Confirming if the user exists at all
    let allowedUsers = await this.readcsvfile()
    let user = allowedUsers.filter((data) => data.code == code)
    return user || null;
}

exports.grantAccess = async (code, discordid, message) => {
    let allowedUsers = await this.readcsvfile();
    // Fixing up the allowed users list
    allowedUsers.map( (user) => { if (user.code == code.trim()) user.discordid = discordid });
    // Fetching the user from the same list using the code as well.
    let user = (allowedUsers.map( (user) => { if (user.code == code.trim()) return user } )).filter( (user) => user )[0];
    // Stringifying it to CSV
    allowedUsers = stringify(allowedUsers, {header: true});
    // Link the discord account to respective discord user in the csv file
    fs.writeFileSync(allowedUsersPath, allowedUsers);

    let role = null; // declare role here, we'll use it later.

    async function giveRoleBy(mode,value) { // Function that allows you to find a role by a specific criteria and grant it to a member
        await message.guild.roles.fetch();
        role = await message.guild.roles.cache.find(role => role[mode] == value);
        await message.member.roles.add(role);
    }

    try {

       await giveRoleBy("id", user.roletogrant); // Try giving them the role criteria'd by ID.

    }
    catch (err) {

        console.log(`Failed to give role based on ID for ${message.author.id}, attempting to grant user role by name.\nError:`);
        console.log(err); // If that fails, log it and try giving them the role criteria'd by name

        try {

            await giveRoleBy("name", "VALORANT Participant"); 

        }
        catch (err) {
            console.log("Failure while trying to give user role by name as well. Aborting.\nError:"); // Coulnd't find that either? Just abort.
            console.log(err);
            message.reply({content: `You were authorized access but I couldn't give you the role, <@${message.author.id}>.\n<@735322421862727760> your assistance is needed, sensei.`});
            // Ask for your help.
        }
    }

    let greetingEmbed = await justfuncs.elongatedEmbed({
        title: "Welcome to the official DPSBN Tech Club server, " + user.name,
        description: `You joined the server as (a part of the)/(a)/ **${role.name || "(oops, i forgot)"}**. You will be able to see and interact with channels that falls under your role's category.\n\nI was built by the Tech Club's President of Gaming, Doog#5101/<@735322421862727760>\n`,
        fields: null
    });

    // Try to send the author a welcome message and delete the code.
    try {
        message.author.send({embeds: [greetingEmbed]})
    } catch (err) {}

    message.delete()
}

exports.joinstatus = async (inString = null) => {

    // Example usage in commands/missing.js

    /* inString => { 
                    missing: function = (user, index) => string literal,
                    present: function = (user, index) => string literal                                          
                    }
     */

    // Basically, the function you provide must take the user and index parameter, add it into a string or whatever and return it so that the bot can return a long concatenated string. Or you can not do that and get an array of user objects.

    let constraints = (user) => ( user && user.confirmation != "(--)" && user.confirmation != "🚫" && !user.club.includes("head")) // A bunch of default constraints to follow when filtering users
    let missingUsers = await this.getFiltered( (user) => (user.discordid == "-" && constraints(user)) );
    let presentUsers = await this.getFiltered( (user) => (user.discordid != "-" && constraints(user)) );

    if (!inString) return { missingUsers: missingUsers, presentUsers, presentUsers }; // Returns an array of each user as an object. Pretty useful when you're using this for literally anything other than .missing

    else {
        let missingUserString = "", presentUserString = "";
        if (inString.present) presentUsers.forEach( (user, index) => presentUserString += inString?.present(user, index) );
        if (inString.missing) missingUsers.forEach( (user, index) => missingUserString += inString?.missing(user, index) );
        return { missingUsers: missingUserString, presentUsers: presentUserString }; // Returns a string of missing/present users formatted in the way inString specifies it to.
    }
}

exports.getFiltered = async (pass_constraint) => {
    // Pass constraint is a function that checks if a user object passes a set of constraints
    
    let allUsers = await this.readcsvfile();
    let filteredUsers = (allUsers.map( (user) => ( pass_constraint(user) ) ? user : null )).filter( (user) => user );
    return filteredUsers;

}

exports.updateConfirmation = async (bn, confirmation) => {

    // Get all users
    let allUsers = await this.readcsvfile()
    // Update the user to change
    allUsers.map( (user) => { if (user.bn.replace(/\D/g,'') == bn) user.confirmation = confirmation });
    // Stringifying it to CSV
    allUsers = stringify(allUsers, {header: true});
    // Push changes to file
    fs.writeFileSync(allowedUsersPath, allUsers);

}