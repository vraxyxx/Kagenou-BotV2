const axios = require("axios");

module.exports = {
  name: "lyrics",
  category: "Music",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID } = event;
    const query = args.join(" ");

    if (!query) {
      return sendMessage(api, { threadID, message: "❌ Please provide a song title!" });
    }

    try {
      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/lyrics?title=${encodeURIComponent(query)}`);
      const { lyrics, title, artist } = response.data;

      if (!lyrics) {
        return sendMessage(api, { threadID, message: "❌ No lyrics found for that song!" });
      }

      // Send lyrics in chunks if too long
      const maxLength = 19000;
      if (lyrics.length > maxLength) {
        return sendMessage(api, { threadID, message: `🎶 *${title}* by *${artist}*\n\n${lyrics.slice(0, maxLength)}...\n\n[Full lyrics might be too long!]` });
      }

      sendMessage(api, { threadID, message: `🎶 *${title}* by *${artist}*\n\n${lyrics}` });

    } catch (error) {
      sendMessage(api, { threadID, message: "❌ Error fetching lyrics. Try another song title!" });
    }
  },
};
