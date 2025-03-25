const fs = require("fs");

const path = require("path");

const bannedUsersFile = path.join(__dirname, "../database/bannedUsers.json");

// Load banned users

const loadBannedUsers = () => {

    try {

        return JSON.parse(fs.readFileSync(bannedUsersFile, "utf8"));

    } catch {

        return {};

    }

};

// Save banned users

const saveBannedUsers = (data) => {

    fs.writeFileSync(bannedUsersFile, JSON.stringify(data, null, 2));

};

module.exports = {

    name: "user",

    description: "Ban users from using bot commands. Admins only.",

    usage: "/user ban | <UID> | <reason>",

    async run({ api, event }) {

        const { threadID, senderID, body, messageID } = event;

        let bannedUsers = loadBannedUsers();

        // Ensure command format is correct

        const parts = body.split("|").map(part => part.trim());

        if (parts.length < 3 || !parts[0].toLowerCase().endsWith("ban")) {

            return api.sendMessage("⚠ Usage: /user ban | <UID> | <reason>", threadID, messageID);

        }

        const userID = parts[1]; // Extract the user ID

        const reason = parts.slice(2).join(" "); // Extract reason

        // Validate user ID

        if (!/^\d+$/.test(userID)) {

            return api.sendMessage("❌ Invalid user ID! User ID should be numeric.", threadID, messageID);

        }

        // Prevent banning an already banned user

        if (bannedUsers[userID]) {

            return api.sendMessage(`⚠ User ${userID} is already banned.\nReason: ${bannedUsers[userID].reason}`, threadID, messageID);

        }

        // Add user to banned list

        bannedUsers[userID] = {

            reason,

            bannedBy: senderID,

            timestamp: new Date().toISOString()

        };

        saveBannedUsers(bannedUsers);

        api.sendMessage(`✅ User ${userID} has been banned.\nReason: ${reason}`, threadID, messageID);

    }

};