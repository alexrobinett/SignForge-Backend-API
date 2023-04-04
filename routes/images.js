const express = require('express');

const router = express.Router();
const imageController = require('../controllers/ImageController')

router
  .route('/')
  .get(imageController.getUserImages)
  .post(imageController.uploadImage)


  

router
  .route('/:id')
  .delete(imageController.deleteImage)
  .get(imageController.getUserImage)
  .patch(imageController.updateFriendlyName)
  
module.exports = router;
