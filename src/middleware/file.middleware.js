const path = require("path")
const multer = require("koa-multer")
const Jimp = require("jimp")

const {
    AVATAR_PATH, PICTURE_PATH
} = require("../constants/file-path")

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, AVATAR_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const avatarUpload = multer({
    storage: avatarStorage
})
const avatarHandler = avatarUpload.single("avatar")



const pictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PICTURE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const pictureUpload = multer({
    storage: pictureStorage
})
const pictureHandler = pictureUpload.array("picture", 9)


const pictureResize = async (ctx,next) => {
    // 1.获取所有的图像信息
    const files = ctx.req.files;
    // 2.对图像进行处理(sharp/jimp)
    for(let file of files) {
        const destPath = path.join(file.destination, file.filename)
        console.log(file.destination);
        console.log(file.filename);
        console.log(destPath);
        const filename = file.filename.split(".")[0]
        const filetype = file.filename.split(".")[1]

        Jimp.read(file.path).then(image => {
            image.resize(1280, Jimp.AUTO).
                write(path.join(`${file.destination}`,
                     filename + "-large." + filetype));
            image.resize(640, Jimp.AUTO).
                write(path.join(`${file.destination}`, 
                    filename + "-middle." + filetype));
            image.resize(320, Jimp.AUTO).
                write(path.join(`${file.destination}`, 
                    filename + "-small." + filetype));

            // image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
            // image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
            // image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
        })
    }
    await next()
}

module.exports = {
    avatarHandler,
    pictureHandler,
    pictureResize
}
