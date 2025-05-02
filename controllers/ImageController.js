const asyncHandler = require('express-async-handler');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const dotenv = require('dotenv');
const Image = require('../models/imageModel');
const User = require('../models/userModel');
const { s3 } = require('../services/s3Service');
dotenv.config();

// Multer-s3 configuration with file validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxSize = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only .jpg, .png, and .gif files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: maxSize },
  fileFilter
});

// @desc    Upload an image
// @route   POST /images/upload
// @access  Private (requires auth middleware to set req.user)
const uploadImage = [
  upload.single('photo'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
    }
    // req.user should be set by authentication middleware
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Save image metadata to DB
    const newImage = new Image({
      owner: userId,
      fileName: req.file.originalname,
      referenceName: req.file.key,
      imageURL: req.file.location,
    });
    await newImage.save();
    // Optionally, update user.images array if you track images on the user model
    res.status(201).json({ message: 'Photo uploaded successfully!', image: newImage });
  })
];


// @desc    Get all images for the authenticated user
// @route   GET /images
// @access  Private (requires auth middleware)
const getUserImages = asyncHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const images = await Image.find({ owner: userId });
  res.json(images);
});

// @desc    Get a single image by ID
// @route   GET /images/:id
// @access  Private (requires auth middleware)
const getUserImage = asyncHandler(async (req, res, next) => {
  const imageId = req.params.id;
  const image = await Image.findById(imageId);
  if (!image) {
    return res.status(404).json({ message: 'Image not found' });
  }
  res.json(image);
});

const { deleteFromS3 } = require('../services/s3Service');

// @desc    Delete an image
// @route   DELETE /images/:id
// @access  Private (requires auth middleware)
const deleteImage = asyncHandler(async (req, res, next) => {
  const imageId = req.params.id;
  const userId = req.user && req.user._id;

  // Find the image
  const image = await Image.findById(imageId);
  if (!image) {
    return res.status(404).json({ message: 'Image not found' });
  }
  // Check ownership
  if (String(image.owner) !== String(userId)) {
    return res.status(403).json({ message: 'Not authorized to delete this image' });
  }

  // Delete from S3
  try {
    await deleteFromS3(image.referenceName);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete image from S3', error: err.message });
  }

  // Remove from DB
  await Image.findByIdAndRemove(imageId);

  // Optionally, remove from user's images array if you track it
  // await User.findByIdAndUpdate(userId, { $pull: { images: imageId } });

  res.json({ message: 'Image deleted successfully' });
});

  const updateFriendlyName =  asyncHandler(async (req, res, next) => {

    try {
      // Get the image ID from the request parameters
      const imageId = req.params.id;
      const imageName = req.body.updateName
      const image = await Image.findById(imageId);
      image.fileName = imageName

      updatedImage = await image.save()

      res.send(`image updated ${updatedImage}`);
    } catch (error) {
      next(error);
    }
  });

module.exports = {
  uploadImage, getUserImage, deleteImage, getUserImages, updateFriendlyName
};
