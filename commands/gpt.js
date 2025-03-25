const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "gpt",
  category: "AI",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID, senderID, messageReply, attachments } = event;

    // Ensure user provided input
    if (args.length === 0 && !messageReply && (!attachments || attachments.length === 0)) {
      sendMessage(api, { threadID, message: "❌ Usage: /gpt3 <prompt> (or reply with an image)" });
      return;
    }

    const prompt = args.join(" ");
    let imageUrl = null;

    // Extract image URL from replied message
    if (messageReply && messageReply.attachments.length > 0) {
      const imageAttachment = messageReply.attachments.find(att => att.type === "photo");
      if (imageAttachment) {
        imageUrl = imageAttachment.url;
      }
    }

    // Extract image URL from direct attachments
    if (attachments && attachments.length > 0) {
      const imageAttachment = attachments.find(att => att.type === "photo");
      if (imageAttachment) {
        imageUrl = imageAttachment.url;
      }
    }

    // Prepare API request
    const imageUrlParam = imageUrl ? `&imageUrl=${encodeURIComponent(imageUrl)}` : "";
    const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-3.5?q=${encodeURIComponent(prompt)}&uid=${senderID}${imageUrlParam}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.response) {
        let aiResponse = response.data.response;

        // Extract image URL using regex
        const imageUrlMatch = aiResponse.match(/<img\s+src="([^"]+)"/);
        const extractedImageUrl = imageUrlMatch ? imageUrlMatch[1].replace(/ /g, "%20") : null;

        if (extractedImageUrl) {
          // Download and send the image as a stream
          const imagePath = path.join(__dirname, "temp.jpg");
          const writer = fs.createWriteStream(imagePath);
          const imageStream = await axios({
            url: extractedImageUrl,
            responseType: "stream",
          });

          imageStream.data.pipe(writer);

          writer.on("finish", () => {
            sendMessage(api, {
              threadID,
              attachment: fs.createReadStream(imagePath),
            });
          });

          writer.on("error", (err) => {
            console.error("❌ Error downloading image:", err);
            sendMessage(api, { threadID, message: "⚠️ Failed to load the AI-generated image." });
          });

        } else {
          // Send text response
          sendMessage(api, { threadID, message: `🤖 GPT-3 Response:\n\n${aiResponse}` });
        }
      } else {
        sendMessage(api, { threadID, message: "❌ No response from GPT-3." });
      }
    } catch (error) {
      console.error("❌ Error in gpt3 command:", error);
      sendMessage(api, { threadID, message: "⚠️ Error: Failed to fetch response from GPT-3." });
    }
  }
};
