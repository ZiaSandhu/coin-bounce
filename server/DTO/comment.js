class CommentDto {
    constructor(comment){
        this._id = comment._id,
        this.content = comment.content,
        this.createdAt = comment.createdAt,
        this.authorName = comment.author.username
    }
}

module.exports = CommentDto