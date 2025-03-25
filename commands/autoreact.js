module.exports = {

    name: "autoReact",

    handleEvent: true,

    async handleEvent({ api, event }) {

        const { messageID, body, threadID } = event;

        if (!body) return;

        // Define keywords and their corresponding reactions

        const reactions = {

            "hello": "👋",

            "hi": "👋",

            "lol": "😂",

            "haha": "🤣",

            "love": "❤️",

            "wow": "😲",

            "sad": "😢",

            "angry": "😡",

            "bot": "🤖",

            "good morning": "🌅",

            "good night": "🌙",

            "thanks": "🙏",

            "prefix": "👾"

        };

        // Check if the message contains a keyword and react

        for (const keyword in reactions) {

            if (body.toLowerCase().includes(keyword)) {

                return api.setMessageReaction(reactions[keyword], messageID, () => {}, true);

            }

        }

    }

};