const Joi = require('joi');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const UserDTO = require('../DTO/user')
const jwtService = require('../services/JWTservice')
const RefreshToken = require('../models/token')
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-={}|;:'\",.<>?/]).{8,32}$/
const authController = {
    
    async register(req,res,next) {
        // validate user input
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password'),
        })

        const {error} = userRegisterSchema.validate(req.body)
        
        // if error in validation -> return error via middleware
        if(error){
            // console.log(error)
            return next(error)
        }
        
        // if email and username exist -> return error
        const {username,name,email,password} = req.body
        
        try {
            const emailInUse = await User.exists({email})
            const usernameInUse = await User.exists({username})
            if(emailInUse){
                const error={
                    status:409,
                    message: 'Email already registered. Use another email!'
                }
                return next(error)
            } 
            if(usernameInUse){
                const error={
                    status:409,
                    message: 'Username not available. Use another name!'
                }
                return next(error)
            }
        } catch (error) {
            return next(error)
        }
        // password hash
        const hashedPassword = await bcryptjs.hash(password,10)

        // store user in database
        let accesToken,refreshToken;
        let user;
        try {
            const userToRegister = new User({
                username,
                name,
                email,
                password: hashedPassword
            });
            user= await userToRegister.save();
            
            accesToken = jwtService.signAccessToken({_id: user._id}, '30m');
            refreshToken = jwtService.signRefreshToken({_id: user._id}, '60m');

        } catch (error) {
            return next(error)
        }
        // store refresh token in database
        await jwtService.storeRefreshToken(refreshToken, user._id);
        // send token to cookies
        res.cookie('accessToken', accesToken, {
            maxAge: 1000*60*60*24,
            httpOnly: true
        });
        
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000*60*60*24,
            httpOnly: true
        });


        // return response
        let userdto = new UserDTO(user)
        res.status(201).json({user: userdto, auth: true})

    },


    async login(req,res,next) {
        const userLoginSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
        const {error} = userLoginSchema.validate(req.body)

        if(error){
            return next(error)
        }
        const {username,password} = req.body
        let user;
        try {
            // const user = await User.findOne({username : username})
            user = await User.findOne({username}) // same as above with shortcut
            if(!user){
                const error = {
                    status: 401,
                    message: "User not found!"
                }
                return next(error)
            }
            // let hashedPassword = bcryptjs.hash(password)
            let match = await bcryptjs.compare(password, user.password) 
            if(!match){
                const error = {
                    status: 401,
                    message: "Invalid Password!"
                }
                return next(error)
            }
        } catch (error) {
            return next(error)
        }
        let userdto = new UserDTO(user)
        
        let accesToken = jwtService.signAccessToken({_id: user._id, username: user.username }, '30m');
        let refreshToken = jwtService.signRefreshToken({_id: user._id}, '60m');
        try {
            RefreshToken.updateOne({
                _id: user._id
            },
            {token: refreshToken},
            {upsert: true} // it mean if record exists update else create new one
            )
        } catch (error) {
            return next(error)
        }
        res.cookie('accessToken', accesToken, {
            maxAge: 1000*60*60*24,
            httponly: true
        });
        
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000*60*60*24,
            httponly: true
        });

        res.status(200).json({user: userdto, auth: true})

    },

    async logout(req,res,next){
        const { refreshToken } = req.cookies
        try {
            await RefreshToken.deleteOne({token: refreshToken})
        } catch (error) {
            return next(error)
            
        }
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

        res.status(200).json({user:null, auth: false})
    },

    async refresh(req,res, next){
        // get refresh token from cookie
        const originalRefreshToken = req.cookies.refreshToken

        // verify token
        let id;
        try {
            id= jwtService.verifyRefreshToken(originalRefreshToken)._id
        } catch (e) {
            const error={
                status: 401,
                message:"Unauthorized"
            }
            return next(error)
        }
        try {
            const match = RefreshToken.findOne({_id: id, token: originalRefreshToken})
            if(!match){
                const error = {
                    status: 401,
                    message:"Unauthorized" 
                }
                return next(error)
            }

        } catch (error) {
            return next(e)
        }
        // generate new token
        // update db, return response
        try {
            const accessToken = jwtService.signAccessToken({_id: id}, '30m');
            const refreshToken = jwtService.signRefreshToken({_id: id}, '60m');

            await RefreshToken.updateOne({_id:id} , {token: refreshToken})
            res.cookie('accessToken', accessToken, {
                maxAge: 1000*60*60*24,
                httponly: true
            });
            
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000*60*60*24,
                httponly: true
            });

        } catch (error) {
            return next(error)
        }
        const user = await User.findOne({_id: id})
        let userdto = new UserDTO(user)
        res.status(201).json({user: userdto, auth: true})
    }
};


module.exports = authController;