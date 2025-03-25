const axios = require("axios");

const fs = require("fs");

const path = require("path");

module.exports = {

    name: "dl",

    description: "Download videos from supported platforms",

    usage: "download <video_url>",

    category: "utility",

    async run({ api, event, args }) {

        const { threadID, messageID } = event;

        const videoURL = args[1];

        if (!videoURL) {

            return api.sendMessage("❌ Please provide a valid video URL.", threadID, messageID);

        }

        const supportedPlatforms = ["instagram", "facebook", "tiktok", "twitter", "soundcloud", "capcut", "pinterest", "youtube"];

        if (!supportedPlatforms.some(platform => videoURL.includes(platform))) {

            return api.sendMessage("❌ Unsupported platform! Supported platforms: Instagram, Facebook, TikTok, Twitter, SoundCloud, CapCut, Pinterest, YouTube.", threadID, messageID);

        }

        api.sendMessage("⏳ Downloading video, please wait...", threadID, messageID);

        try {

            const apiUrl = `https://kaiz-apis.gleeze.com/api/kaiz-downloader?url=${encodeURIComponent(videoURL)}`;

            const response = await axios.get(apiUrl);

            if (!response.data.result || !response.data.result.url) {

                return api.sendMessage("❌ Failed to get video download link!", threadID, messageID);

            }

            const videoDownloadURL = response.data.result.url;

            const videoPath = path.join(__dirname, "temp", `${Date.now()}.mp4`);

            const videoStream = await axios({

                url: videoDownloadURL,

                method: "GET",

                responseType: "stream"

            });

            const writer = fs.createWriteStream(videoPath);

            videoStream.data.pipe(writer);

            writer.on("finish", () => {

                api.sendMessage(

                    { body: "✅ Here is your downloaded video!", attachment: fs.createReadStream(videoPath) },

                    threadID,

                    () => fs.unlinkSync(videoPath)

                );

            });

        } catch (error) {

            console.error(error);

            api.sendMessage("❌ Error downloading the video!", threadID, messageID);

        }

    }

};