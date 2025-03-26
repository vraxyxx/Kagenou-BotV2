const axios = require("axios");

module.exports = {
    config: {
        name: "ping",
        description: "Check bot response time.",
        usage: "/ping",
        hasPermission: 0
    },

    onStart: async function ({ api, event }) {
        const { threadID, messageID } = event;
        const start = Date.now();

        api.sendMessage("🏓 Pinging...", threadID, (err, info) => {
            if (err) return;

            const end = Date.now();
            const ping = end - start;

            api.editMessage(`🏓 Pong! Response time: ${ping}ms`, info.messageID);
        });
    }
};
