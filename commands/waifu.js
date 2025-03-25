const axios = require("axios");

const fs = require("fs");

const path = require("path");

module.exports = {

    name: "waifu",

    nonPrefix: true,

    author: "Aljur Pogoy",

    description: "Get a random waifu image.",

    async run({ api, event }) {

        try {

            const { data } = await axios.get("https://kaiz-apis.gleeze.com/api/waifu");

            if (!data || !data.imageUrl) {

                return api.sendMessage("❌ No waifu image received from the API.", event.threadID, event.messageID);

            }

            const imagePath = path.join(__dirname, "waifu.jpg");

            // Download the image

            const response = await axios.get(data.imageUrl, { responseType: "arraybuffer" });

            fs.writeFileSync(imagePath, response.data);

            // Send the image as an attachment

            api.sendMessage({

                body: `Here's your waifu! ❤️\nCredits: ${data.author}`,

                attachment: fs.createReadStream(imagePath)

            }, event.threadID, event.messageID, () => {

                // Delete the file after sending

                fs.unlinkSync(imagePath);

            });

        } catch (error) {

            api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);

        }

    }

};