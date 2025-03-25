const axios = require("axios");

module.exports = {
  name: "pinterest",
  category: "Images",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID } = event;

    // Check if the user provided a search term
    if (args.length === 0) {
      sendMessage(api, { threadID, message: "❌ Usage: /pinterest <search term>" });
      return;
    }

    // Extract the search query
    const searchQuery = args.join(" ");

    try {
      // Construct the API URL
      const apiUrl = `https://kaiz-apis.gleeze.com/api/pinterest?search=${encodeURIComponent(searchQuery)}`;

      // Fetch data from the API
      const response = await axios.get(apiUrl);

      // Check if the API returned results
      if (response.data.success && response.data.image) {
        sendMessage(api, { threadID, message: `🔍 Here is a Pinterest image for "${searchQuery}":`, attachment: response.data.image });
      } else {
        sendMessage(api, { threadID, message: "❌ No images found. Try a different search term." });
      }
    } catch (error) {
      console.error("Error in pinterest command:", error);
      sendMessage(api, { threadID, message: "❌ Failed to fetch images. API might be down." });
    }
  },
};
