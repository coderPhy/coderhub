const fileService = require("../service/file.service");
const userService = require("../service/user.service")
const { APP_HOST, APP_PORT } = require("../app/config")

class FileController {
    async saveAvatarInfo(ctx, next) {
        console.log("saveAvatarInfo");
        // 1.获取图像相关的信息
        const {originalname,  mimetype, size } = ctx.req.file
        const { id } = ctx.user
        // 2.将图像信息数据保存到数据库(avatar)中
        const result = await fileService.createAvatar(originalname, mimetype, size, id)
        // 3. 将图片地址保存在user表中
        const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
        await userService.updateAvatarUrlById(avatarUrl, id)
        ctx.body = "用户上传成功"
    }
    async savePictureInfo(ctx, next) {
        console.log("给动态添加配图");
        // 1.获取图像信息
        const files = ctx.req.files;
        const { id } = ctx.user;
        const { momentId } = ctx.query;

        // 2. 将所有的文件信息保存到数据库中
        for (let file of files) {
            const { originalname,  mimetype, size } = file
            try {
                await fileService
                    .createFile(originalname, mimetype, size, id, momentId)
            } catch (error) {
                console.log(error);
            }
        }

        ctx.body = "动态配图上传完成~"
    }
}





module.exports = new FileController()