const express = require('express');
const router = express.Router();
const StoreMessage = require('../models/messageModel')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try{
    const messages = await StoreMessage.find()
    res.json(messages)
  }catch(error) {
    res.status(500).json({message: error.message})
  }

});

router.post('/', async (req,res,next)=> {
  const message = new StoreMessage({
    imageOne: req.body.imageOne,
    imageTwo: req.body.imageTwo,
    imageThree: req.body.imageThree,
    price: req.body.price,
    quantity: req.body.quantity,
    points: req.body.points,
    promo: req.body.promo,
    promoLineOne: req.body.promoLineOne,
    promoLineTwo: req.body.promoLineTwo,
    disclaimerLineOne: req.body.disclaimerLineOne,
    disclaimerLineTwo: req.body.disclaimerLineTwo,
  })
  try{
    const newMessage = await message.save()
    res.status(201).json(newMessage)
  } catch (error){
    res.status(400).json({message: error.message})
  }
})

router.get('/:id', getStoreMessage ,function(req, res, next) {
  res.json(res.adSpotMessage)
});


router.delete('/:id', getStoreMessage, async (req,res) =>{
  spotMessage = res.adSpotMessage
  try {
    await spotMessage.deleteOne()
    res.json({Message: "deleted message!"})
  } catch (error) {
    res.status(500).json({Message: error.message})
  }
})

router.get('/images/:path', getImage)

function getImage(req, res, next){
  res.download(`./public/images/${req.params.path}`)
}

async function getStoreMessage(req,res, next){
  let message

  try{
    message = await StoreMessage.findById(req.params.id)
    if(message == null){
      return res.status(404).json({Message: 'Cannot Find Message'})
    }
  } catch(error){
    return res.status(500).json({Message: error.message} )
  }
  res.adSpotMessage = message
  next()
}

module.exports = router;
