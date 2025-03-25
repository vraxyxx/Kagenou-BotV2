const fs = require("fs");
const path = require("path");

module.exports = {
  name: "lock",
  category: "Admin",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID, senderID } = event;
    
    // Only allow admins to use this command
    if (!admins.includes(senderID)) {
      sendMessage(api, { threadID, message: "❌ You are not an admin!" });
      return;
    }

    // Load the config.json file
    const configPath = path.join(__dirname, "../config.json");
    let config = {};
    
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (!config.lockedThreads) config.lockedThreads = [];
    } catch (error) {
      console.error("❌ Error loading config.json:", error);
      sendMessage(api, { threadID, message: "❌ Failed to load configuration." });
      return;
    }

    if (args[1] === "unlock") {
      // Unlock the thread
      config.lockedThreads = config.lockedThreads.filter(id => id !== threadID);
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      sendMessage(api, { threadID, message: "🔓 Commands are now **enabled** for everyone!" });
    } else {
      // Lock the thread
      if (!config.lockedThreads.includes(threadID)) {
        config.lockedThreads.push(threadID);
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        sendMessage(api, { threadID, message: "🔒 Commands are now **disabled** for users (Admins can still use them)." });
      } else {
        sendMessage(api, { threadID, message: "⚠️ This chat is already locked!" });
      }
    }
  },
};
