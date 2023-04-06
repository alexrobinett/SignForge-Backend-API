const asyncHandler = require('express-async-handler');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const Image = require('../models/imageModel');
const User = require('../models/userModel');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_BUCKET_REGION,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

const uploadImage = asyncHandler(async (req, res) => {

  try {
    console.log(req.body)
    upload.single('photo')(req, res, async (error) => {
      if (error) {
        console.error(error);
        res.status(500).send('Server error');
      } else {

        // Get the user that uploaded the photo
        const user = await User.findById(req.body.id);
        console.log(req.body)

        // Save the reference to the photo in the user's documentdelete
        const newImage = new Image({
          owner: user._id,
          fileName: req.file.originalname,
          referenceName: req.file.key,
          imageURL: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${req.file.key}`,
        });
        await newImage.save();
        user.images.push(newImage._id);
        await user.save();
        res.send('Photo uploaded successfully!');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const getUserImages = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]

    id = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
          if (err) return res.status(403).json({ message: 'Forbidden' })       
          return decoded.UserInfo.userId }
  )

    // Query the database for the images belonging to the user
    const images = await Image.find({ owner: id });
    // Build an array of image URLs

    res.send(images);
  } catch (error) {
    next(error);
  }
});

const getUserImage = asyncHandler(async (req, res, next) => {
  try {
    // Get the image ID from the request parameters
    const imageId = req.params.id;
    console.log(req.params.id);
    // Query the database for the image with the specified ID
    const image = await Image.findById(imageId);

    res.send(image);
  } catch (error) {
    next(error);
  }
});

const deleteImage = asyncHandler(async (req, res, next) => {
    try {
      // Get the image ID from the request parameters
      const imageId = req.params.id;
      console.log(req.params.id);
      // Query the database for the image with the specified ID
      const image = await Image.findById(imageId);
  
      // Delete the image from Amazon S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: image.referenceName,
      };
  
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
  
      // Remove the image reference from the user's document
      const userName = await User.findById(image.owner);
      userName.images.pull(imageId);
      await userName.save();
  
      // Remove the image from the database
      await Image.findByIdAndRemove(imageId);
  
      // Remove the image ID from the user's document
      const user = await User.findById(image.owner);
      const index = user.images.indexOf(imageId);
      if (index > -1) {
        user.images.splice(index, 1);
      }
      await user.save();
  
      res.send('Image deleted successfully');
    } catch (error) {
      next(error);
    }
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
