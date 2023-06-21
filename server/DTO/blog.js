class BlogDto {
    constructor(blog){
        this.id = blog._id
        this.title = blog.title,
        this.author = blog.author,
        this.content = blog.content,
        this.photo = blog.photoPath
    }
}
module.exports = BlogDto