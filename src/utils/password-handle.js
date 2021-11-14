const crypto = require("crypto")

const md5password = (password) => {
    const md5 = crypto.createHash("md5")
    // 将对象转化为16进制的字符串
    const result = md5.update(password).digest("hex")
    return result
}

module.exports = md5password