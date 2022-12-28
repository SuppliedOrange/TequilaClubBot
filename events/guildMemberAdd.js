// yeah so basically back in the old ages (last week) we used to kick ppl who weren't on the invite list :)
// we're not meanies anymore

/*
module.exports = {
    name: 'guildMemberAdd',
    async execute(member, bot) {
        const csvfuncs = require("../csvfuncs")

        let discordid = member.user.id;
        let allowedUsers = await csvfuncs.readcsvfile();
        let user = (allowedUsers.map( (user) => { if (user.discordid.trim() == discordid) return user } )).filter( (user) => user );
        if (!user) return;
    }
}
*/