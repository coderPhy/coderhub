const connection = require("../app/database.js")

class FileService {
    async createAvatar(filename, mimetype, size, userId) {
        const statement = `
            INSERT INTO avatar (filename, mimetype, size, user_id) 
            VALUES (?,?,?,?);
        `
        try {
            const [ result ] = await connection.execute(statement, 
                [filename, mimetype, size, userId]) 
            return result
        } catch (error) {
            console.log(error);
        }
    }
    async getAvatarByUserId(userId) {
        // 需要改
        const statement = `SELECT * FROM avatar WHERE user_id = ?`
        // const statement = `SELECT * FROM user WHERE id = ?`
        const [ result ] = await connection.execute(statement, [userId])        
        return result.pop()
    }
    async createFile(filename, mimetype, size, userId, momentId) {
        const statement = `
            INSERT INTO file (filename, mimetype, size, user_id, moment_id)
                VALUES (?,?,?,?,?);
        `
        try {
            const [ result ] = await connection.execute(statement, 
                [filename, mimetype, size, userId, momentId]) 
            return result;
        } catch (error) {
            console.log(error);
        }
    }
    async getFileByFilename(filename) {
        const statement = `SELECT * FROM file WHERE filename = ?`
        const [ result ] = await connection.execute(statement, [ filename ])
        return result[0];
    }
}

module.exports = new FileService()