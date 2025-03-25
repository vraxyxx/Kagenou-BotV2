module.exports.config = {

    name: "react",

    description: "Sends a message and reacts when the user adds a reaction.",

    usage: "!react"

};

module.exports.run = async ({ api, event, globalData }) => {

    const { threadID, messageID } = event;

    // Send a message and store its ID in globalData

    api.sendMessage("React to this message!", threadID, (err, msgInfo) => {

        if (err) return console.error("❌ Error sending message:", err);

        // Store the messageID in globalData to track reactions

        globalData.set(msgInfo.messageID, {

            command: "react"

        });

    });

};

// 🔹 Handle reactions

module.exports.onReaction = async ({ api, event }) => {

    const { threadID } = event;

    // Reply when a reaction is detected

    api.sendMessage("Okay!", threadID);

};