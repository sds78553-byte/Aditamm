const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'droppyshop',       // 🔁 Replace with your Cloudinary cloud name
  api_key: 'YOUR_API_KEY',        // 🔁 Replace with your Cloudinary API key
  api_secret: 'YOUR_API_SECRET',  // 🔁 Replace with your Cloudinary API secret
});

module.exports = cloudinary;
