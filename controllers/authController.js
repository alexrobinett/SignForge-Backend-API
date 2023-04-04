const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


const login = asyncHandler(async (req, res) => {
    const {email, password } = req.body

    if(!email||!password){
        return res.status(400).json({Message: 'All fields Required'})
    }

    const foundUser = await User.findOne({email: email}).exec()
    
    if (!foundUser){
        return res.status(401).json({Message: 'Unauthorized'})
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match)  return res.status(401).json({Message: 'Unauthorized'})

    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "userId": foundUser._id,
                "Name": foundUser.firstName
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '10s'}
    )

    const refreshToken = jwt.sign(
        { "userId": foundUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7*24*60*60*1000
    })

    res.json({accessToken})

})

  const refresh = asyncHandler(async (req, res) => {

    const cookies = req.cookies
    console.log(cookies.jwt)
    if(!cookies?.jwt) return res.status(401).json({Message: 'Unauthorized'})
    
    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({Message: 'Forbidden'})

            const foundUser = await User.findOne({_id: decoded.userId})

            if(!foundUser) return res.status(401).json({Message: 'Unauthorized'})

            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "userId": foundUser._id,
                        "Name": foundUser.firstName
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '10s'}
            )

            res.json({accessToken})
        })
    )
    
  });

  const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({Message: 'Cookie Cleared'})
    
  });



  module.exports = {
   logout, refresh, login
  };