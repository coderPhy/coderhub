const Router = require("koa-router")

const {
    verifyAuth
} = require("../middleware/auth.middleware.js")
const {
    avatarHandler,
    pictureHandler,
    pictureResize
} = require("../middleware/file.middleware.js")
const {
    saveAvatarInfo,
    savePictureInfo
} = require("../controller/file.controller.js")
const fileRouter = new Router({ prefix: "/upload" })


fileRouter.post("/avatar", verifyAuth, avatarHandler, saveAvatarInfo)
fileRouter.post("/picture", verifyAuth, pictureHandler, pictureResize, savePictureInfo )

module.exports = fileRouter










