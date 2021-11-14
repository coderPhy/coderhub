const connection = require("../app/database")

// 权限判断
class AuthService {
    // async checkMoment(momentId, userId) {
    //     const statement = `SELECT * FROM moment WHERE id = ? AND user_id = ?;`
    //     const [ result ] = await connection.execute(statement, [momentId, userId])
    //     return result.length === 0?  false: true
    // }
    async checkResource(tableName, id, userId) {
        const statement = `SELECT * FROM ${ tableName } WHERE id = ? AND user_id = ?;`
        const [ result ] = await connection.execute(statement, [id, userId])
        return result.length === 0?  false: true
    }
}


module.exports = new AuthService()