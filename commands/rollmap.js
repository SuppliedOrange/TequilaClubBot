exports.run = async (bot, message, args) => {

    const { MessageEmbed } = require('discord.js');

    // Declaring the Map class
    class Map {
        constructor(name, description, image) {
            this.name = name;
            this.description = description
            this.image = image;
        }
    }
    
    // All maps in the pool
    const PEARL = new Map(
        "PEARL",
        "Attackers push down into the Defenders on this two-site map set in a vibrant, underwater city. Pearl is a geo-driven map with no mechanics. Take the fight through a compact mid or the longer range wings in our first map set in Omega Earth.",
        "https://asset.vg247.com/1920x1080-KEY-ART-pearl.png/BROK/resize/1920x1920%3E/format/jpg/quality/80/1920x1080-KEY-ART-pearl.png"
    );
    
    const FRACTURE = new Map(
        "FRACTURE",
        "A top secret research facility split apart by a failed radianite experiment. With defender options as divided as the map, the choice is yours: meet the attackers on their own turf or batten down the hatches to weather the assault.",
        "https://imageio.forbes.com/specials-images/imageserve/61324d995b3960f60572de2d/0x0.jpg"
    );

    const BREEZE = new Map(
        "BREEZE",
        "Take in the sights of historic ruins or seaside caves on this tropical paradise. But bring some cover. You'll need them for the wide open spaces and long range engagements. Watch your flanks and this will be a Breeze.",
        "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt9834851b906877fe/6082129712dc9d3c683578ec/4_27_2021_Patch2.8Article_Banner.jpg"
    );

    const ICEBOX = new Map(
        "ICEBOX",
        "Your next battleground is a secret Kingdom excavation site overtaken by the arctic. The two plant sites protected by snow and metal require some horizontal finesse. Take advantage of the ziplines and they'll never see you coming.",
        "https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png"
    );

    const BIND = new Map(
        "BIND",
        "Two sites. No middle. Gotta pick left or right. What's it going to be then? Both offer direct paths for attackers and a pair of one-way teleporters make it easier to flank.",
        "https://images.adsttc.com/media/images/6250/51db/3e4b/314f/7800/0006/large_jpg/bind6.jpg?1649430999"
    );

    const HAVEN = new Map(
        "HAVEN",
        "Beneath a forgotten monastery, a clamour emerges from rival Agents clashing to control three sites. Theress more territory to control, but defenders can use the extra real estate for aggressive pushes.",
        "https://cdn.firstsportz.com/wp-content/uploads/2021/06/24055436/Adobe_Post_20210611_1506380.8123258898845319.jpg"
    );

    const SPLIT = new Map(
        "SPLIT",
        "If you want to go far, you'll have to go up. A pair of sites split by an elevated center allows for rapid movement using two rope ascenders. Each site is built with a looming tower vital for control. Remember to watch above before it all blows sky-high.",
        "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltee14888179d221f8/5ee7d51725b4740c330ba55d/Loading_Screen_Split_v2.jpg"
    );

    const ASCENT = new Map(
        "ASCENT",
        "An open playground for small wars of position and attrition divide two sites on Ascent. Each site can be fortified by irreversible bomb doors; once they're down, you'll have to destroy them or find another way. Yield as little territory as possible.",
        "https://s3-eu-central-1.amazonaws.com/www-staging.esports.com/WP%20Media%20Folder%20-%20esports-com/app/uploads/2021/08/Ascent.jpg"
    );
    
    // Adding all the maps to an array
    let maps = [PEARL, FRACTURE, BREEZE, ICEBOX, BIND, HAVEN, SPLIT, ASCENT];

    // Random loading messages to mess w people.
    let loadingMessages = [
        "Hacking HDFC bank lockers...",
        "Learning coding from Whitehat Jr...",
        "Solving derivatives and integrations...",
        "Assessing whether Pearl is a good map or not...",
        "Getting the match-fixed map from Doog...",
        "Fetching maps from the Valorant API...",
        "Attemping to mine ethereum...",
        "$ sudo get_map valorant_maplist = map => output(map)", // dont flame me for this pseudocode nobody knew ok shush
        "Deleting System32..."
    ]

    // Sending x loading messages
    let x = Math.floor( Math.random() * (loadingMessages.length - 4) );

    // Function to shuffle an array
    function* shuffle(array) {

        var i = array.length;
    
        while (i--) {
            yield array.splice(Math.floor(Math.random() * (i+1)), 1)[0];
        }
    
    }

    // Shuffling messages
    loadingMessages = shuffle(loadingMessages);

    // Picking a map
    const chosenMap = maps[ Math.floor(Math.random() * maps.length) ];

    // Function to generate the rollmap embed
    function rollembed(title="No Title", description = "", image_link = null) {

        let generatedEmbed = new MessageEmbed()
        .setColor('DARK_AQUA')
        .setTitle(title)
        .setDescription(description)
        .setImage(image_link)
        .setTimestamp(new Date())

        return generatedEmbed
    }

    const rollmessage = await message.channel.send({ embeds: [ rollembed(loadingMessages.next().value) ] })

    for (let i = 0; i < x; i++) {
        await new Promise(r => setTimeout(r, 2000));
        rollmessage.edit({ embeds: [ rollembed(loadingMessages.next().value) ] })
    }

    // Finally, sending the map.
    await new Promise(r => setTimeout(r, 2000));
    rollmessage.edit({ embeds: [ rollembed(chosenMap.name, chosenMap.description, chosenMap.image) ] });

}
