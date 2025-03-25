const fs = require("fs");

const path = require("path");

const config = require("../config.json");

const disabledCommandsFile = path.join(__dirname, "../database/disabledCommands.json");

// Load disabled commands

const loadDisabledCommands = () => {

    if (!fs.existsSync(disabledCommandsFile)) return [];

    return JSON.parse(fs.readFileSync(disabledCommandsFile, "utf8"));

};

// Save disabled commands

const saveDisabledCommands = (disabledCommands) => {

    fs.writeFileSync(disabledCommandsFile, JSON.stringify(disabledCommands, null, 2));

};

module.exports = {

    name: "system",

    description: "Manage bot settings and commands.",

    usage: "system <command>",

    async run({ api, event, args }) {

        const senderID = event.senderID;

        const threadID = event.threadID;

        if (!config.admins.includes(senderID)) {

            return api.sendMessage("❌ You are not authorized to use this command.", threadID);

        }

        const subCommand = args[0]?.toLowerCase();

        const param = args.slice(1).join(" ");

        const disabledCommands = loadDisabledCommands();

        switch (subCommand) {

            case "list":

                return api.sendMessage("📜 Available commands:\n" + getCommandsList(), threadID);

            case "enable":

                if (!param) return api.sendMessage("⚠ Please specify a command to enable.", threadID);

                if (!disabledCommands.includes(param)) return api.sendMessage(`✅ Command '${param}' is already enabled.`, threadID);

                disabledCommands.splice(disabledCommands.indexOf(param), 1);

                saveDisabledCommands(disabledCommands);

                return api.sendMessage(`✅ Command '${param}' has been enabled.`, threadID);

            case "disable":

                if (!param) return api.sendMessage("⚠ Please specify a command to disable.", threadID);

                if (disabledCommands.includes(param)) return api.sendMessage(`❌ Command '${param}' is already disabled.`, threadID);

                disabledCommands.push(param);

                saveDisabledCommands(disabledCommands);

                return api.sendMessage(`❌ Command '${param}' has been disabled.`, threadID);

            case "status":

                return api.sendMessage("✅ Bot is running smoothly!", threadID);

            case "help":

                return api.sendMessage("ℹ Use 'system list' to see available commands.", threadID);

            default:

                return api.sendMessage("⚠ Invalid command. Use 'system list' to view available commands.", threadID);

        }

    }

};

// 📌 Function to get all available system commands

function getCommandsList() {

    return `

1. list - Show all system commands

2. enable <command> - Enable a command

3. disable <command> - Disable a command

4. status - Show bot status

5. help - Show help message

6. system list - Display this list

    `.trim();

}