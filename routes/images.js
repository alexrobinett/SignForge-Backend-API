const express = require('express');

const router = express.Router();
const imageController = require('./controllers/imageController');

router
  .route('/')
  .get(imageController.getUserImages)
  .post(imageController.uploadImage)
  .delete(imageController.deleteImage);

router.route('/:id').get(imageController.getUserImage);

module.exports = router;
