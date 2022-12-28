exports.run = async (bot, message, args) => {

    const owners = [
        "735322421862727760" // Doog
    ]

    //if (!owners.includes(message.author.id)) return

    message.channel.send({
        embeds: [
            {
                title: "All commands",
                description: `\n
                **.whois**: Find the identity of anyone registered in the server. Mention the target or type in the first few letters of their username as an argument.\n
                **.statusupdate**: List of all users that have joined and not joined this server from the bot list\n
                **.missing**: \`.statusupdate\` but it's only the people who haven't joined the server yet\n
                **.invite**: You cannot.\n
                **.args**: Returns any arguments you provide\n
                **.ping**: Check the latency\n
                **.help**: This.`,
                color: "#FFFFFF",
                timestamp: new Date()
            }
        ]
    });
}

