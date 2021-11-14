const service = require("../service/comment.service")

class CommentController {
    async create(ctx, next) {
        const { momentId, content } = ctx.request.body
        const { id } = ctx.user
        const result = await service.create(momentId, content, id)
        ctx.body = result;
    }
    async reply(ctx, next) {
        const { momentId, content } = ctx.request.body;
        const { commentId } = ctx.request.params
        const { id } = ctx.user;
        const result = await service.reply(id, content, commentId, momentId)
        ctx.body = result
    }
    async update(ctx, next) {
        const { commentId } = ctx.request.params;
        const { content } = ctx.request.body;
        const result = await service.update(commentId, content)
        ctx.body = result
    }
    async remove(ctx, next) {
        const { commentId } = ctx.request.params;
        const result = await service.remove(commentId)
        ctx.body = result
    }
    async list(ctx, next) {
        const { momentId } = ctx.request.query
        const result =  await service.getCommentsByMomentId(momentId)
        ctx.body = result
    }
}

module.exports = new CommentController()