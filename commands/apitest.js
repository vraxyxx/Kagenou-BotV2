const axios = require("axios");

module.exports = {

    name: "apitest",

    author: "Aljur Pogoy",

    description: "Test any API directly from the bot.",

    

    async run({ api, event, args }) {

        if (args.length === 0) {

            return api.sendMessage("❌ Please provide an API URL.\nUsage: /apitest <API_URL>", event.threadID, event.messageID);

        }

        const apiUrl = args[1];

        // Validate URL (only allow safe https requests)

        if (!apiUrl.startsWith("https://")) {

            return api.sendMessage("❌ Only HTTPS API endpoints are allowed for security reasons.", event.threadID, event.messageID);

        }

        try {

            api.sendMessage("⏳ Sending request, please wait...", event.threadID, event.messageID);

            // Fetch API response

            const response = await axios.get(apiUrl);

            const jsonResponse = JSON.stringify(response.data, null, 2); // Format response as JSON

            // Send response (limit message length for Messenger)

            const maxLength = 1900; // Avoid exceeding message limits

            const message = jsonResponse.length > maxLength

                ? jsonResponse.substring(0, maxLength) + "\n... (response too long, truncated)"

                : jsonResponse;

            api.sendMessage(`api Response:\n\`\`\`\n${message}\n\`\`\``, event.threadID, event.messageID);

        } catch (error) {

            console.error("❌ API Request Error:", error);

            api.sendMessage(`❌ Failed to fetch API response.\nError: ${error.response ? error.response.data : error.message}`, event.threadID);

        }

    }

};