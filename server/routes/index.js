const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const blogController = require('../controller/blogController')
const commentController = require('../controller/commentController')
const auth = require('../middleware/auth')

//user routes
//login
router.post('/login',authController.login)
//register
router.post('/register',authController.register)
// logout
router.post('/logout',auth,authController.logout)
// refresh
router.get('/refresh',authController.refresh)

// blog routes
// create
router.post('/blog',auth,blogController.create)
// get all
router.get('/blog/show',auth,blogController.getAll)
// get by id
router.get('/blog/:id',auth,blogController.getById)
// update
router.put('/blog/update',auth,blogController.update)
// delete
router.delete('/blog/:id',auth,blogController.delete)

// comment

// create
router.get('/comment',auth,commentController.create)
// get by Id
router.get('/comment/:id',auth,commentController.getById)

module.exports = router