const service = require("../service/label.service")

class labelController {
    async create(ctx, next) {
        const { content } = ctx.request.body
        const result = await service.create(content)
        ctx.body = result
    } 
    async list(ctx, next) {
        const { offset, size } = ctx.request.query
        const result = await service.getLabels(offset, size)
        ctx.body = result
    }
}

module.exports = new labelController()