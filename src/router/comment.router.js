const Router = require("koa-router")
const {
    verifyAuth,
    verifyPermission
} = require("../middleware/auth.middleware")

const {
    create,
    reply,
    update,
    remove,
    list
} = require("../controller/comment.controller")

const commentRouter = new Router({prefix: "/comment"})

// 新增评论
commentRouter.post("/", verifyAuth, create)
commentRouter.post("/:commentId/reply", verifyAuth, reply)
// 修改评论
commentRouter.patch("/:commentId", verifyAuth, 
    verifyPermission, update)
// commentRouter.patch("/:commentId", verifyAuth, 
//     verifyPermission("moment"), update)
// 删除评论 
commentRouter.delete("/:commentId", verifyAuth, 
    verifyPermission, remove)
commentRouter.get("/", list)
module.exports = commentRouter

 