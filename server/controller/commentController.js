const Joi = require('joi');
const Comment = require('../models/comment');
const CommentDto = require('../DTO/comment');

const IdPattern = /^[a-fA-F0-9]{24}$/

const commentController = {
    async create(req,res,next){

        const createCommentSchema = Joi.object({
            blog: Joi.string().regex(IdPattern).required(),
            author: Joi.string().regex(IdPattern).required(),
            content: Joi.string().required()
        });
        const {error} = createCommentSchema.validate(req.body)

        if(error){
            return next(error)
        }
        const {blog, author, content } = req.body
        const newComment = new Comment({
            blog, author, content
        })
        let comment
        try {
            comment = await newComment.save()
        } catch (error) {
            console.log(error)
            return next(error)
        }
        res.status(201).json({comment,msg:"Comment created"})
    },
    async getById(req,res,next){
        const getCommentSchema = Joi.object({
            id: Joi.string().regex(IdPattern).required()
        });
        const {error} = getCommentSchema.validate(req.params)
        if(error){
            return next(error)
        }

        const {id} = req.params;

        let comments,commentdto;
        try {
            commentdto = []
            comments = await Comment.find({blog: id}).populate('author')
            comments.forEach(comment => {
                commentdto.push(new CommentDto(comment))
            });
        } catch (error) {
            console.log(error)
            return next(error)
        }

        res.status(200).json({data:commentdto})
    }
}

module.exports = commentController