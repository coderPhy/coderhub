const connection = require("../app/database")

class CommentService {
    async create(momentId ,content ,userId) {
        const statement = `
            INSERT INTO comment
                ( content, moment_id, user_id ) 
            VALUES
                (?,?,?);
        `
        const [ result ] =  await connection.execute(statement, [content, momentId, userId ])
        return result
    }
    async reply(userId, content, commentId, momentId) {
        const statement = `
        INSERT INTO comment (user_id, content, comment_id, moment_id)
        VALUES (?,?,?,?)
        `
        const [ result ] = await connection.execute(statement, 
            [userId, content, commentId, momentId])
        return result         
    }
    async update(commentId, content) {
        const statement = `UPDATE comment set content = ? WHERE id = ?`
        const [result] = await connection.execute(statement, [content, commentId])
        return result;
    }
    async remove(commentId) {
        const statement = `DELETE FROM comment WHERE id = ?`
        const [ result ] = await connection.execute(statement, [commentId])
        return result;   
    }
    async getCommentsByMomentId(momentId) {
        try {
            const statement = `
                SELECT 
                    c.id id, c.content content,c.comment_id commentId,
                    c.createAt createTime,c.updateAt updateTime,
                    JSON_OBJECT("id", u.id, "name", u.name) user
                FROM comment c 
                LEFT JOIN user u ON c.user_id = u.id
                WHERE moment_id = ?;
            `
            const [ result ] = await connection.execute(statement, [momentId])
            return result
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new CommentService()