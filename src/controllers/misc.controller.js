const Service = require('../db/models/Service.model');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Api_Key,
    api_secret: process.env.Api_Secret
});

const upload = async(req,res)=>{
        const files = req.files.img
        await cloudinary.uploader.upload(files.tempFilePath, {
            quality: 80 // Change the quality value as needed
        }, async (err, result) => {
            res.send({
                result:result.secure_url
            })
        })
}

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
