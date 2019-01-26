const Source = require('mongoose').model('Source');
const cloudinary = require('cloudinary').v2;

const index = (req, res, next) => {
    res.render('sources/index');
};

const upSource = (req, res, next) => {
    //  get errors and source-inputs from "post" /upSource (validate middleware) using flash
    // if non-exist assign with empty-obj
    const errors = req.flash('errors-validate')[0] || {};
    const source = req.flash('source-inputs')[0] || {};

    // if exist
    // push errors and source-input back to user
    res.render('sources/upSource', {
        errors,
        source
    });
};

const postUpSource = (req, res, next) => {
     // file was not uploaded redirecting to upload 
    if (req.files.file_upload.size == 0)
        return res.redirect('/sources/upSource');

    const source = new Source();
    source.author = req.user.id;
    source.file_name = req.files.file_upload.originalFilename;
    source.description = req.body.description;
    source.title = req.body.title;

    // Get temp file path 
    var filePath = req.files.file_upload.path;
    // Upload file to Cloudinary
    cloudinary.uploader.upload(filePath, {tags: 'sources_sharing'})
        .then(function (file_data) {
            console.log('** file_data uploaded to Cloudinary service');
            console.dir(file_data);
            source.file_data = file_data;
            // Save source with file_data metadata
            return source.save();
        })
        .then(function (photo) {
            console.log('** source saved')
        })
        .catch(err => console.log(err))
        .finally(function () {
            res.redirect('/sources');        
        });
};

module.exports = {
    index,
    upSource,
    postUpSource
}