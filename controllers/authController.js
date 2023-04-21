const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


const login = asyncHandler(async (req, res) => {
    const {email, password } = req.body

    if(!email||!password){
        return res.status(400).json({Message: 'All fields Required'})
    }

    const foundUser = await User.findOne({email: `${email}`}).exec()
    
    if (!foundUser){
        return res.status(401).json({Message: 'Unauthorized'})
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match)  return res.status(401).json({Message: 'Unauthorized'})

    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "userId": foundUser._id,
                "email": foundUser.email,
                "name": foundUser.firstName
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30m'}
    )

    const refreshToken = jwt.sign(
        {  
        "userId": foundUser._id,
        "email": foundUser.email,
        "name": foundUser.firstName },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '5d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });
      

    res.json({accessToken})

})

const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            
            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "userId": foundUser._id,
                        "email": foundUser.email,
                        "name": foundUser.firstName
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            )

            res.json({ accessToken })
        }
    )
}


  

  const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({Message: 'Cookie Cleared'})
    
  });



  module.exports = {
   logout, refresh, login
  };