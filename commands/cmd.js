const fs = require("fs");

const path = require("path");

const commandsDir = path.join(__dirname, "../commands");

module.exports = {

    name: "cmd",

    description: "Install temporary commands",

    usage: "/cmd install <filename.js> <command code>",

    async run({ api, event, args }) {

        const { threadID, messageID, senderID, body } = event;

        // Ensure user input is correct

        if (!args.length) return api.sendMessage("⚠ Usage: /cmd install <filename.js> <command code>", threadID, messageID);

        // Ensure only bot admins can install commands

        const config = require("../config.json");

        if (!config.admins.includes(senderID)) return api.sendMessage("❌ Only bot admins can install commands.", threadID, messageID);

        // Extract command name and code

        const input = body.slice(body.indexOf("install") + 7).trim();

        const firstSpaceIndex = input.indexOf(" ");

        

        if (firstSpaceIndex === -1) {

            return api.sendMessage("⚠ Usage: /cmd install <filename.js> <command code>", threadID, messageID);

        }

        const fileName = input.slice(0, firstSpaceIndex).trim();

        const commandCode = input.slice(firstSpaceIndex + 1).trim();

        if (!fileName.endsWith(".js")) {

            return api.sendMessage("⚠ Error: Command file must have a `.js` extension.", threadID, messageID);

        }

        const commandPath = path.join(commandsDir, fileName);

        try {

            // Write command to the commands folder

            fs.writeFileSync(commandPath, commandCode, "utf8");

            // Load the new command dynamically

            delete require.cache[require.resolve(commandPath)];

            const newCommand = require(commandPath);

            // Register command

            global.commands.set(newCommand.name.toLowerCase(), newCommand);

            if (newCommand.nonPrefix) global.nonPrefixCommands.set(newCommand.name.toLowerCase(), newCommand);

            return api.sendMessage(`✅ Command '${fileName}' installed successfully!`, threadID, messageID);

        } catch (error) {

            console.error("Error installing command:", error);

            return api.sendMessage(`❌ Failed to install command: ${error.message}`, threadID, messageID);

        }

    }

};