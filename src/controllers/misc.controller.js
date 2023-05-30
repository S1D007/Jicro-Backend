const Service = require('../db/models/Service.model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Api_Key,
  api_secret: process.env.Api_Secret
});

const upload = async (req, res) => {
  try {
    if (!req.files || !req.files.img) {
      return res.status(400).send({
        response: false,
        error: 'No file found in the request'
      });
    }

    const file = req.files.img;
    const allowedTypes = ['image/jpeg', 'image/png']; // Allowed file types

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).send({
        response: false,
        error: 'Invalid file type. Only JPEG and PNG files are allowed.'
      });
    }

    await cloudinary.uploader.upload(file.tempFilePath, {
      quality: 80 // Change the quality value as needed
    }, (err, result) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).send({
          response: false,
          error: 'An error occurred while uploading the file'
        });
      }

      res.send({
        response: true,
        result: result.secure_url
      });
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send({
      response: false,
      error: 'An error occurred during file upload'
    });
  }
};

const search = async (req, res) => {
    const { term, page = 1, perPage = 5 } = req.body;
    const services = await Service.find({
      $or: [
        { title: { $regex: new RegExp(term, 'i') } },
        { details: { $regex: new RegExp(term, 'i') } },
        { included: { $regex: new RegExp(term, 'i') } },
        { notIncluded: { $regex: new RegExp(term, 'i') } },
      ],
    }).select('title _id images').limit(perPage).skip((page - 1) * perPage)
    res.json({
        response:true,
        data:services
    });
}

module.exports = {upload , search}
