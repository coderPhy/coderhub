const connection = require("../app/database.js")
 
class MomentService {
    async insertInto(userId, content) {
        const statement = `INSERT INTO moment (content, user_id) VALUES(?, ?)`;
        const [ result ] = await connection.execute(statement, [content, userId])
        return result;
    }
    async getMomentById(momentId) {
        const statement2 = `
        SELECT 
            m.id id, m.content content,m.createAt createTime,m.updateAt updateTime,
            JSON_OBJECT("id", u.id, "name", u.name, "avatar", u.avatar_url) user,
            IF(COUNT(l.id),JSON_ARRAYAGG(
                JSON_OBJECT("id", l.id, "name", l.name)
            ) ,NULL) labels,
            (SELECT IF(COUNT(c.id), JSON_ARRAYAGG(
                JSON_OBJECT("id", c.id, "content", c.content,"commentId",
                c.comment_id, "createTime", c.createAt,			
                "user",JSON_OBJECT("id", cu.id, "name", cu.name, "avatarUrl", cu.avatar_url)
                )
            ),NULL) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id 
                WHERE m.id = c.moment_id) comments,
            (SELECT JSON_ARRAYAGG(CONCAT("http://47.107.55.171:8008/moment/images/",file.filename)) 
        FROM moment m
        LEFT JOIN user u ON m.user_id = u.id 
        LEFT JOIN moment_label ml ON m.id = ml.moment_id
        LEFT JOIN label l ON ml.label_id = l.id
        WHERE
                m.id = ?
        GROUP BY m.id;	
        `

        const statement = `
            SELECT 
                m.id, m.content content,m.createAt createTime,
                m.updateAt updateTime,
                JSON_OBJECT("id", u.id, "name", u.name) user,
                IF(COUNT(l.id),JSON_ARRAYAGG(
                    JSON_OBJECT("id", l.id, "name", l.name)
                ) ,NULL) labels,
                (SELECT IF(COUNT(c.id), JSON_ARRAYAGG(
                    JSON_OBJECT("id", c.id, "content", c.content,"commentId",
                        c.comment_id, "createTime", c.createAt,			
                        "user",JSON_OBJECT("id", cu.id, "name", cu.name)
                    )
                ),NULL) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id 
                WHERE m.id = c.moment_id) comments,
                (SELECT JSON_ARRAYAGG(CONCAT("http://47.107.55.171:8008/moment/images/",file.filename)) FROM file WHERE m.id = file.moment_id) images
            FROM moment m
            LEFT JOIN user u ON m.user_id = u.id 
            LEFT JOIN moment_label ml ON m.id = ml.moment_id
            LEFT JOIN label l ON ml.label_id = l.id
            WHERE
            m.id = ?
            GROUP BY m.id;  
        `
        try {
            const [ result ] = await connection
                .execute(statement, [ momentId ])
            return result[0]
        } catch (error) {
            console.log(error);
        }
    }
    async getMomentList(offset, size) {
        try {
            const statement = `
                SELECT
                    m.id, m.content, m.createAt createTime, m.updateAt updateTime,
                    JSON_OBJECT("id", u.id,"name", u.name) user,
                    (SELECT COUNT(*) FROM comment c WHERE m.id = c.moment_id) commentCount,
                    (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
                    (SELECT JSON_ARRAYAGG(CONCAT("http://47.107.55.171:8008/moment/images/",file.filename)) 
                        FROM file WHERE m.id = file.moment_id) images
                FROM
                    moment m
                LEFT JOIN user u ON m.user_id = u.id
                limit ? , ?
            `
            const [ result ] =await connection.execute(statement, [offset, size])
            return result
        } catch (error) {
            console.log(error);
        }
    }
    async updata(content, momentId) {
        const statement = `UPDATE moment set content = ? WHERE id = ?`
        const [ result ] = await connection.execute(statement, [content, momentId])
        return result
    }
    async remove(momentId) {
        const statement = `DELETE from moment WHERE id = ?`
        const [result] = await connection.execute(statement, [momentId])
        return result
    }
    async addLabels(momentId, labelId) {
        const statement = `
            INSERT INTO moment_label (moment_id, label_id) VALUES (?,?);
        `; 
        const [ result ] = 
            await connection.execute(statement, [momentId, labelId])
        return result
    }
    async hasLabel(momentId, labelId) {
        const statement = `
            SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;
        `
        const [ result ] =
            await connection.execute(statement, [momentId, labelId])
        return Boolean(result[0])
    }
}

module.exports = new MomentService()



