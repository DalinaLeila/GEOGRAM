const cloudinary = require('cloudinary')
const config = require('../config')

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_KEY,
    api_secret: config.CLOUDINARY_SECRET
})

function upload(path) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(path, function(result) {
            resolve(result)
        })
    })
}

module.exports = {
    upload
}
