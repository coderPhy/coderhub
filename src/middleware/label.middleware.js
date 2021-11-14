const service = require("../service/label.service")
const verifyLabelExists = async (ctx, next) => {
    // 1. 取出要添加的所有标签
    const { labels } = ctx.request.body;
    // 2. 判断每一个标签在label表中是否存在
    const newLabels = [];
    for (let name of labels) {
        const labelResult = await service.getLabelByName(name)
        const label = { name }
        if (!labelResult) {
            // 标签不存在时创建
            const result = await service.create(name)
            label.id = result.insertId
        } else {
            // 存在时在查询的结果取id
            label.id = labelResult.id
        }
        newLabels.push(label)
    }

    ctx.labels = newLabels
    await next()
}

module.exports = {
    verifyLabelExists
}
