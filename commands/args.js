exports.run = async (bot, message, args) => {
    console.log(args)
    message.channel.send(args.join(' ') || "No arguments");
}