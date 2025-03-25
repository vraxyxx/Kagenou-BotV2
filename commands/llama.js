const axios = require("axios");

module.exports = {
    name: "llama",
    author: "Aljur Pogoy",
    description: "Chat with Llama 70B AI",
    
    async run({ api, event, args }) {  
        const { threadID, messageReply, senderID } = event;  
        let query = args.join(" ");

        // Support for replying to a message
        if (messageReply && messageReply.body) {
            query = messageReply.body;
        }

        if (!query) {  
            return api.sendMessage("⚠ Usage: /llama <your message> or reply to a message.", threadID);  
        }  

        const apiUrl = `https://yt-video-production.up.railway.app/Llama70b?ask=${encodeURIComponent(query)}`;  

        try {  
            const response = await axios.get(apiUrl);  
            const reply = response.data.response || "❌ No response from Llama 70B AI.";  

            api.sendMessage(reply, threadID);  
        } catch (error) {  
            api.sendMessage("❌ Error fetching response from Llama 70B AI.", threadID);  
            console.error("Llama 70B AI Error:", error);  
        }  
    }
};