const jwt= require('jsonwebtoken')
const RefreshToken = require('../models/token')
const ACCESS_TOKEN_SECRET = '9d66de3c134d5529c41289ec377c4871bd8d12c7b3d5dda59045a8e29c936834965a18e648d10ec917344ba0032b6ddee2c891c82d230c9b91105150f348eec0'
const REFRESH_TOKEN_SECRET = "f984b3b50e18f7249013eff7123c3d38945cb705139d2cbf0a0f09c57b586fa0a493a26e76afde6b54715c32ee99dad17f7770ff4db786889f9c09c4d6d675a2"


class JWTservice{

    // sign access token
    static signAccessToken(payload, expiryTime, secret = ACCESS_TOKEN_SECRET){
        return jwt.sign(payload, secret, {expiresIn: expiryTime})
    }

    // sign refresh token
    static signRefreshToken(payload, expiryTime, secret=REFRESH_TOKEN_SECRET){
        return jwt.sign(payload, secret, {expiresIn: expiryTime})
    }

    // verify access Token
    static verifyAccessToken(token){
        return jwt.verify(token,ACCESS_TOKEN_SECRET)
    }

    // verify access Token
    static verifyRefreshToken(token){
        return jwt.verify(token,REFRESH_TOKEN_SECRET)
    }
    // store refresh token 
    static async storeRefreshToken(token, userId){
        try {
            const newToken = new RefreshToken({
                token,
                userId
            })
            await newToken.save()
        } catch (error) {
            
        }
    }
}

module.exports = JWTservice;