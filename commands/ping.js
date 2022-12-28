exports.run = async (bot, message, args) => {
    // unfortunately, this bot does not reply with 'pong'
    // terribly sorry for breaking the tradition
    message.channel.send("**" + bot.ws.ping + " ms**");
}