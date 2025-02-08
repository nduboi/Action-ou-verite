const {getConnection, closeConnection} = require('../config/db');
const bcrypt = require('bcryptjs');
const token = require('crypto');

function generateToken() {
    return token.randomBytes(32).toString('hex');
}

async function addChallenge(challenge, type, username, res) {
    const conn = await getConnection();

    try {
        //TODO: change value by challenge
        const [rows, fields] = await conn.execute('INSERT INTO `challenge`(`value`, `TYPE`, `username`) VALUES (?, ?, ?)', [challenge, type, username]);
        closeConnection(conn);
        return true;
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
        return false;
    }
}

async function getChallenge(type) {
    const conn = await getConnection();

    const [rows, fields] = await conn.execute('SELECT `value` FROM `challenge` WHERE `TYPE` = ?', [type]);
    if (rows.length === 0) {
        return "No challenge found";
    }
    const randomChallenge = rows[Math.floor(Math.random() * rows.length)].value;
    closeConnection(conn);
    return randomChallenge;
}

async function getAllChallenge() {
    const conn = await getConnection();

    const [rows, fields] = await conn.execute('SELECT `value`, `TYPE`, `username` FROM `challenge`');
    closeConnection(conn);
    return rows.length ? rows : [];
}


module.exports = { addChallenge, getChallenge, getAllChallenge };