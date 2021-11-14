const fs = require("fs")

const userService = require("../service/user.service.js")
const fileService = require("../service/file.service.js")
const { AVATAR_PATH } = require("../constants/file-path.js")

class UserController {
    async create(ctx, next) {
        // 获取用户的请求参数
        const user = ctx.request.body;
        // 查询数据 
        const result = await userService.create(user)
        // 返回数据
        ctx.body = result
    }
    async avatarInfo(ctx, next) {
        // 1.用户的头像是哪一个文件
        const { userId } = ctx.params
        const avatarInfo = await fileService.getAvatarByUserId(userId)
        ctx.response.set("content-type", avatarInfo.mimetype);
        ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
    }
}

module.exports = new UserController()