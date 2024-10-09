const fs = require('fs');
const path = require('path');

exports.uploadChatImage = async function (req, res) {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const image = req.files.image;
    const uploadPath = path.join(__dirname, '../uploads/chat-images', image.name);

    // Ensure the uploads directory exists
    fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

    // Move the file to the uploads directory
    image.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving file', error: err });
      }
      res.json({ filePath: `uploads/chat-images/${image.name}` });
    });
  } catch (error) {
    console.error('Unexpected error during file upload:', error);
    res.status(500).json({ message: 'Server error during file upload', error: error });
  }
};