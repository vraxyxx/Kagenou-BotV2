module.exports = {
  name: "uid",
  category: "Utility",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID, senderID, messageReply, mentions } = event;

    let targetID;
    let targetName;

    // If the user mentioned someone, get their UID
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0]; // Get the first mentioned user's UID
      targetName = mentions[targetID]; // Get their name
    } 
    // If replying to a message, get the replied user's UID
    else if (messageReply) {
      targetID = messageReply.senderID;
      targetName = "the replied user";
    } 
    // If no mention or reply, use the sender's UID
    else {
      targetID = senderID;
      targetName = "You";
    }

    // Send the UID as a response
    sendMessage(api, { threadID, message: `🆔 ${targetName}'s UID: ${targetID}` });
  }
};
