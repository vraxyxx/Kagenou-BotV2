const { exec } = require("child_process");

module.exports = {
  name: "shell",
  author: "Aljur Pogoy",
  description: "Execute shell commands (Admins only).",

  async run({ api, event, args }) {
    const { threadID, senderID } = event;
    const allowedAdmins = ["100073129302064"]; // Replace with your Facebook ID

    if (!allowedAdmins.includes(senderID)) {
      return api.sendMessage("❌ You are not authorized to use this command.", threadID);
    }

    const command = args.join(" ");
    if (!command) {
      return api.sendMessage("⚠️ Please provide a shell command to execute.", threadID);
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return api.sendMessage(`❌ Error: ${error.message}`, threadID);
      }
      if (stderr) {
        return api.sendMessage(`⚠️ Stderr: ${stderr}`, threadID);
      }
      api.sendMessage(`✅ Output:\n${stdout}`, threadID);
    });
  }
};
