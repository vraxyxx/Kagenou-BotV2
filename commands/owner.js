const axios = require('axios');
const path = require('path'); // Import the 'path' module

module.exports = {
  name: 'developer',
  category: 'Admin',
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID } = event;
    const developer = {
      name: 'Aljur Pogoy',
      gfname: 'Ana Sophia',
      height: "5'8",
      age: 17,
      imageUrl: path.join(__dirname, '../image/c55534714fe57cdb9e580d32923c8856.jpg') // Correct path
    };
    const message = `Developer Information 🧾
Name: ${developer.name}
gfname: ${developer.gfname}
height: ${developer.height}
Age: ${developer.age}`;

    try {
      // Use the 'fs' module to read the file
      const imageData = fs.readFileSync(developer.imageUrl);
      // Send the image as a base64 encoded string
      await sendMessage(api, { threadID, message, attachment: Buffer.from(imageData).toString('base64') });
    } catch (error) {
      console.error("Error sending image:", error);
      await sendMessage(api, { threadID, message: "Error sending image. Please try again." });
    }
  },
};
       
