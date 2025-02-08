const {getConnection, closeConnection} = require('../config/db');
const bcrypt = require('bcryptjs');
const token = require('crypto');
const getenv = require('getenv');

function generateToken() {
    return token.randomBytes(32).toString('hex');
}
async function login(email, password, res, jwt) {
    const conn = await getConnection();
    const [rows, fields] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
        await closeConnection(conn);
        res.status(404).json({ error: 'User not found' });
        return false;
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        res.status(401).json({ error: 'Invalid password' });
        return false;
    }
    conn.release();
    const token = jwt.sign({ email: email, username: user.username }, getenv('SECRET_KEY_JWT'), { expiresIn: '1h' });
    return token;
}

async function register(email, password, username, res, jwt) {
    const conn = await getConnection();
    let [rows, fields] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
        await closeConnection(conn);
        res.status(409).json({ error: 'Email already exists' });
        return false;
    }
    try {
        [rows, fields] = await conn.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            await closeConnection(conn);
            res.status(409).json({ error: 'Username already exists' });
            return false;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await conn.execute('INSERT INTO users (email, password, username, token) VALUES (?, ?, ?, ?)', [email, hashedPassword, username, generateToken()]);
        await closeConnection(conn);
        return jwt.sign({ email: email, username: username }, getenv('SECRET_KEY_JWT'), { expiresIn: '1h' });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
        return false;
    }
    return true;
}

module.exports = { login, register };