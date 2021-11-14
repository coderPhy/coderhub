const fs = require("fs")

const service = require("../service/moment.service.js") 
const fileService = require("../service/file.service.js")
const {
    PICTURE_PATH
} = require("../constants/file-path.js")
const {
    APP_HOST,
    APP_PORT
} = require("../app/config")

class MomentController {
    async create(ctx, next) {
        // 获取数据(user_id, content)
        const id = ctx.user.id
        const content = ctx.request.body.content;
        // 2. 将数据插入到数据库
        const result = await service.insertInto(id, content)
        ctx.body = result;
    }
    async detail(ctx, next) {
        // 获取数据 (momentId)
        const momentId = ctx.params.momentId;
        // 2. 根据id去查询这条数据
        const result = await service.getMomentById(momentId)
        ctx.body = result
    } 
    async list(ctx, next) {
        // 1.获取数据(offset/size)
        const { offset, size } = ctx.query
        // 2.查询列表 
        const result = await service.getMomentList(offset, size)
        ctx.body = result
    } 
    async update(ctx, next) {
        // 1.获取参数
        const { momentId } = ctx.params
        const { content } = ctx.request.body

        // 2. 修改内容
        const result = await service.updata(content, momentId)
        ctx.body = result
    }
    async remove(ctx, next) {
        // 1. 获取momentId 
        const { momentId } = ctx.request.params
        const result = await service.remove(momentId);
        ctx.body = result;
    }
    async addlabels(ctx, next) {
        // 判断某个动态是否存在某个标签
        const { labels } = ctx;
        const { momentId } = ctx.params;
        for(let label of labels) {
            const isExists = await service.hasLabel(momentId, label.id)
            if(!isExists) {
                await service.addLabels(momentId, label.id)
            }
        }
        ctx.body = "给动态添加标签成功~"
    }
    async fileInfo(ctx, next) {
        const { filename } = ctx.params;
        const { type } = ctx.query
        const types = ["small", "middle", "large"];
        const fileInfo = await fileService.getFileByFilename(filename)
        let left = filename.split(".")[0];
        let right = filename.split(".")[1];
        if (types.some(item => item === type)) {
            left = filename.split(".")[0] + "-" + type
            right = filename.split(".")[1]
        }

        ctx.response.set("content-type", fileInfo.mimetype);
        ctx.body = fs.createReadStream(PICTURE_PATH + left + "." + right)
        console.log(PICTURE_PATH + left + "." + right);
    }
}

module.exports = new MomentController()