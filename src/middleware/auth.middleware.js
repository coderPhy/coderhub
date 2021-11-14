const jwt = require("jsonwebtoken")
const config = require("../app/config")
const service = require("../service/user.service") 
const authService = require("../service/auth.service")
const errorTypes = require("../constants/error-types")
const md5password = require("../utils/password-handle")
 
const verifyLogin = async (ctx, next) => {
    // 1.获取用户名和密码
    const { username, password } = ctx.request.body
    // 2.判断用户名和密码是否空
    if (!username || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
        return ctx.app.emit("error", error, ctx);
    }
    // 3.判断用户是否存在(用户不存在)
    const result = await service.getUserByName(username)
    const user = result[0]
    if (!user) {
        const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
        return ctx.app.emit("error", error, ctx)
    }
    // 4.判断密码是否和数据库中的密码一致(加密)
    if(md5password(password) !== user.password) {
        const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
        return ctx.app.emit("error", error, ctx)
    }

    ctx.user = user
    await next()
}  
// 验证token
const verifyAuth = async (ctx, next) => {
    // console.log(ctx.request);
    const authorization = ctx.header.authorization;
    if (!authorization) {
        const error = new Error(errorTypes.UNAUTHORIZATION) 
        return ctx.app.emit("error", error, ctx)
    }
    const token = authorization.replace("Bearer ", "")

    try {
        const result = jwt.verify(token, config.PUBLIC_KEY, {
            algorithms: ["RS256"]
        })
        ctx.user = result
        await next()
        console.log("token验证通过...");
    } catch (error) {
        const err = new Error(errorTypes.UNAUTHORIZATION)
        ctx.app.emit("error", err, ctx )
    }
} 

const verifyPermission = async (ctx, next) => {
    console.log("权限验证的middleware~");
    // 1.获取参数
    const [ resourceKey ] = Object.keys(ctx.params)
    const tableName = resourceKey.replace("Id", "")
    const resourceId = ctx.params[resourceKey]
    const { id } = ctx.user
    // 2. 查看是否具备权限
    try {
        const isPermission = await authService.
            checkResource(tableName, resourceId, id)
        if (!isPermission) throw new Error();
        await next()
    } catch (error) {
        const err = new Error(errorTypes.UNPERMISSION)
        return ctx.app.emit("error", err, ctx)
    }
}

module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission
}
