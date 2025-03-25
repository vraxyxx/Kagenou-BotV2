const fs = require("fs");

module.exports = {

    name: "approve",

    author: "Aljur Pogoy",

    description: "Approve or remove thread access",

    

    async run({ api, event, args }) {

        const { threadID, messageID } = event;

        const dataPath = __dirname + "/cache/approvedThreads.json";

        const pendingPath = __dirname + "/cache/pendingThreads.json";

        if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));

        if (!fs.existsSync(pendingPath)) fs.writeFileSync(pendingPath, JSON.stringify([]));

        let data = JSON.parse(fs.readFileSync(dataPath));

        let pending = JSON.parse(fs.readFileSync(pendingPath));

        let idBox = args[1] || threadID;

        if (args[1] === "list") {

            let msg = "✅ Approved Threads:\n";

            let count = 0;

            for (const e of data) {

                msg += `\n${++count}. ID: ${e}`;

            }

            return api.sendMessage(msg || "No approved threads found.", threadID, messageID);

        } 

        if (args[1] === "del") {

            idBox = args[1] || threadID;

            if (isNaN(parseInt(idBox))) return api.sendMessage("❌ Invalid ID.", threadID, messageID);

            if (!data.includes(idBox)) return api.sendMessage("❌ This thread was not approved!", threadID, messageID);

            api.sendMessage(`❌ Thread ${idBox} has been removed from the approval list.`, threadID, () => {

                if (!pending.includes(idBox)) pending.push(idBox);

                data.splice(data.indexOf(idBox), 1);

                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

                fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

            }, messageID);

            return;

        }

        if (args[1] === "pending") {

            let msg = "⏳ Pending Approval:\n";

            let count = 0;

            for (const e of pending) {

                const name = (await api.getThreadInfo(e)).name || "Unnamed Group";

                msg += `\n${++count}. ${name} (ID: ${e})`;

            }

            return api.sendMessage(msg || "No pending approvals.", threadID, messageID);

        }

        if (isNaN(parseInt(idBox))) return api.sendMessage("❌ Invalid thread ID.", threadID, messageID);

        if (data.includes(idBox)) return api.sendMessage(`⚠ Thread ${idBox} is already approved.`, threadID, messageID);

        api.sendMessage("✅ This thread has been approved.", idBox, (error) => {

            if (error) {

                return api.sendMessage("❌ Error: Invalid ID or the bot is not in this thread.", threadID, messageID);

            }

            data.push(idBox);

            pending.splice(pending.indexOf(idBox), 1);

            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

            fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

            api.sendMessage(`✅ Approval successful: ${idBox}`, threadID, messageID);

        });

    }

};