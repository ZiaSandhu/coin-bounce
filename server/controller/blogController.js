const Joi = require('joi')
const fs = require('fs') // built in file system module
const Blog = require('../models/blog')
const {backend_server_path} = require('../config/index')
const BlogDto = require('../DTO/blog')
const BlogAuthorDto = require('../DTO/blog_detail')
const { Error } = require('mongoose')
const Comment = require('../models/comment')

const IdPattern = /^[a-fA-F0-9]{24}$/

const blogController = {
    async create(req,res,next){
        //  validate request body
        // client -> base64 encoded photo -> decode -> store -> save photopath db
        const createBlogSchema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().regex(IdPattern).required(),
            content: Joi.string().required(),
            photo: Joi.string().required(),
        });
        const {error} = createBlogSchema.validate(req.body)

        if(error){
            return next(error)
        }

        const {title,author,content,photo} = req.body
        // handle photo 
        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg):base64,/,""),'base64')
        const imagePath = `storage/${Date.now()}-${author}.png`
        // storing locally
        try {
            fs.writeFileSync(imagePath,buffer)
        } catch (error) {
            return next(error)
        }

        // save to database
        let blog; 
        try {
            const newBlog = new Blog({
                title,
                author,
                content,
                photoPath: `${backend_server_path}/${imagePath}`
            });
            blog = await newBlog.save()
        } catch (error) {
            return next(error)
        }
        const newBlogDto = new BlogDto(blog)
        // return response
        res.status(201).json({blog})
    },
    async getAll(req,res,next){
        try {
            let blogDto = []
            const blogs = await Blog.find({})
            blogs.forEach(blog => {
                blogDto.push(new BlogDto(blog))
            });
            res.status(200).json({blog: blogDto})
        } catch (error) {
            return next(error)
        }
    },
    async getById(req,res,next){
        const getByIdSchema = new Joi.object({
            id: Joi.string().regex(IdPattern).required()
        });
        // console.log(req.params)
        const {error} = getByIdSchema.validate(req.params)
        if(error){
            return next(error)
        }
        let blog;
        const {id} = req.params
        try {
            // blog = await Blog.findOne({_id : id})
            blog = await Blog.findOne({_id : id}).populate('author') // also give complete ref to user-> author
        } catch (error) {
            return next(error)
        }
        res.status(200).json({blog: new BlogAuthorDto(blog)})

    },
    async update(req,res,next){
        const updateSchema = Joi.object({
            title: Joi.string(),
            content: Joi.string(),
            author: Joi.string().regex(IdPattern).required(),
            blogId: Joi.string().regex(IdPattern).required(),
            photo: Joi.string()
        })
        const {error} = updateSchema.validate(req.body)
        if (error){
            console.log(error)
            return next(Error)
        }
        const {title, content, author, blogId, photo} = req.body
        let blog;
        try {
            blog = await Blog.findOne({_id : blogId})
        } catch (error) {
        console.log(error)

            return next(error)
        }
       if(!photo){ 
            await Blog.updateOne({ _id : blog._id },
            { title, content })
        }else{
            
            let previousPath = blog.photoPath;
            previousPath = previousPath.split('/').at(-1);
            try {
                fs.unlinkSync(`storage/${previousPath}`)
            } catch (error) {
                console.log(error)
                return next(error)
            }

            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg):base64,/,""),'base64')
            const imagePath = `storage/${Date.now()}-${author}.png`
            // storing locally
            try {
                fs.writeFileSync(imagePath,buffer)
            } catch (error) {
                console.log(error)
                return next(error)
            }

            await Blog.updateOne({
                _id:blogId
            },{
                title,
                content,
                photoPath: `${backend_server_path}/${imagePath}`
            })

        }
        res.status(200).json({msg: "Blog Updated"})
    },
    async delete(req,res,next){
        const deleteBlogSchema = Joi.object({
            id: Joi.string().regex(IdPattern).required()
        });
        const {error} = deleteBlogSchema.validate(req.params)
        if(error){
            return next(error)
        }
        const id = req.params.id
        let blog;
        try {
            blog = await Blog.findOne({_id: id})
        } catch (error) {
            console.log(error)
            return next(error)
        }
        let photoPath = blog.photoPath
        photoPath = photoPath.split('/').at(-1)
        
        try {
            fs.unlink(`storage/${photoPath}`)
        } catch (error) {
            console.log(error)
            return next(error)
        }
        try {
            await Blog.deleteOne({_id: id})
            await Comment.deleteMany({blog: id})
        } catch (error) {
            console.log(error)
            return next(error)
        }
        res.status(200).json({message: "Blog Deleted!"})
    },
}
module.exports = blogController