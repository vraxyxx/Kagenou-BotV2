const fs = require("fs");

const path = require("path");

module.exports = {

    name: "create",

    description: "Create a bot with a custom prefix and appstate.",

    usage: "/create | <prefix> | <appstate>",

    async run({ api, event }) {

        const args = event.body.split(" | ").map(arg => arg.trim());

        if (args.length < 3) {

            return api.sendMessage("⚠ Use: /create | <prefix> | <appstate>", event.threadID);

        }

        const prefix = args[1];

        const appstateData = args.slice(2).join(" ");

        try {

            JSON.parse(appstateData); // Validate JSON format

        } catch (error) {

            return api.sendMessage("❌ Invalid appstate format. Make sure it's a valid JSON structure.", event.threadID);

        }

        // Ensure `database/` directory exists in the main system

        const databasePath = path.join(__dirname, "../../database");

        const cookieFilePath = path.join(databasePath, "cookie.json");

        if (!fs.existsSync(databasePath)) {

            fs.mkdirSync(databasePath, { recursive: true }); // Create `database/` if missing

        }

        const botConfig = {

            prefix: prefix,

            appstate: JSON.parse(appstateData),

        };

        try {

            fs.writeFileSync(cookieFilePath, JSON.stringify(botConfig, null, 2), "utf-8");

            console.log(`✅ New bot created with prefix: ${prefix}`);

            api.sendMessage(`✅ Your bot has been created!\nPrefix: ${prefix}\nThe bot will now run with your appstate.`, event.threadID);

        } catch (error) {

            console.error("❌ Error saving to database/cookie.json:", error);

            api.sendMessage("❌ Failed to create bot. The system may not have write access.", event.threadID);

        }

    }

};