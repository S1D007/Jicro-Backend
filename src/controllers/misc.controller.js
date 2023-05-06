const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Api_Key,
    api_secret: process.env.Api_Secret
});

const upload = async(req,res)=>{
        const files = req.files.img
        await cloudinary.uploader.upload(files.tempFilePath, async (err, result) => {
            res.send({
                result:result.url
            })
        })
}

module.exports = upload