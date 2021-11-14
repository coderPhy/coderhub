const Router = require("koa-router")
const { verifyAuth, verifyPermission} = require("../middleware/auth.middleware")
const {
    verifyLabelExists
} = require("../middleware/label.middleware")

const {
    create,
    detail,
    list,
    update,
    remove,
    addlabels,
    fileInfo
} = require("../controller/moment.controller.js")

const momentRouter = new Router({ prefix: "/moment" })
// 创建动态接口
momentRouter.post("/", verifyAuth, create)
// 获取动态接口(单个)
momentRouter.get("/:momentId", detail)
// 获取动态接口(列表)
momentRouter.get("/", list)
// 修改动态接口 1.用户必须登录 2.用户具备权限
momentRouter.patch("/:momentId", verifyAuth, 
    verifyPermission, update)
// 删除动态接口
momentRouter.delete("/:momentId", verifyAuth, 
    verifyPermission, remove);
// 给动态添加标签 
momentRouter.post("/:momentId/labels", verifyAuth, 
    verifyPermission, verifyLabelExists, addlabels)
// 动态配图的服务
momentRouter.get("/images/:filename", fileInfo)

// momentRouter.delete("/:momentId", verifyAuth, 
//     verifyPermission("moment"), remove);
//     momentRouter.patch("/:momentId", verifyAuth, 
//     verifyPermission("moment"), update)

module.exports = momentRouter