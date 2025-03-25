const axios = require("axios");

const fs = require("fs");

const { exec } = require("child_process");

module.exports = {

    name: "update",

    description: "Check for updates and apply them.",

    usage: "/update",

    async run({ api, event }) {

        const updateUrl = "https://raw.githubusercontent.com/DeveloperOfGeoArchonMorax/Kagenou-Bot/main/package.json";

        const updateFilePath = "./package.json";

        try {

            // Fetch the latest update information

            const response = await axios.get(updateUrl);

            const latestUpdate = response.data;

            // Read the current package.json

            const currentUpdate = JSON.parse(fs.readFileSync(updateFilePath, "utf8"));

            // Compare versions

            if (latestUpdate.version === currentUpdate.version) {

                return api.sendMessage("✅ You are already using the latest version.", event.threadID);

            }

            // List updates

            const updateMessage = `⚡ The new update is available!\n\n` +

                `📌 Version: ${latestUpdate.version}\n\n` +

                `🔹 List of updates:\n${latestUpdate.changelog ? latestUpdate.changelog.join("\n") : "- No changelog provided -"}\n\n` +

                `➡ React to this message to confirm the update.`;

            api.sendMessage(updateMessage, event.threadID, (err, info) => {

                if (err) return console.error(err);

                global.client.reactionListener[info.messageID] = async ({ userID, messageID }) => {

                    if (userID === event.senderID) {

                        api.sendMessage("⏳ Updating... Please wait.", event.threadID);

                        

                        // Run update command

                        exec("git pull && npm install", (error, stdout, stderr) => {

                            if (error) {

                                return api.sendMessage(`❌ Update failed: ${error.message}`, event.threadID);

                            }

                            api.sendMessage("✅ Update completed! Restarting bot...", event.threadID, () => {

                                process.exit(1);

                            });

                        });

                    }

                };

            });

        } catch (error) {

            console.error("Update check error:", error);

            api.sendMessage("❌ Failed to check for updates. Please try again later.", event.threadID);

        }

    }

};