const connections = require("../app/database")

class UserService {
    async create(user) {
        const { username, password } = user
        const statement = `INSERT INTO user(name, password) VALUES(?,?);`
        const result = await connections.execute(statement, [username, password])
        return result[0];
    }
    async getUserByName(name) {
        const statement = `SELECT * FROM user WHERE name = ?;`
        const result = await connections.execute(statement, [name])
        return result[0];
    }
    async updateAvatarUrlById(avatarUrl, userId) {
        const statement = `UPDATE user SET avatar_url = ? WHERE id = ?;`;
        const [ result ] = await connections.execute(statement, [avatarUrl, userId]);
        return result;
    }
}

module.exports = new UserService()