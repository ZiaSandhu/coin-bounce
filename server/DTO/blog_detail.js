class BlogAuthorDto{
    constructor(blog){
        this.id = blog.id,
        this.title = blog.title,
        this.authorName = blog.author.name,
        this.authorUserName = blog.author.username,
        this.content = blog.content,
        this.photo = blog.photoPath
        this.createdAt = blog.createdAt
    }
}
module.exports = BlogAuthorDto