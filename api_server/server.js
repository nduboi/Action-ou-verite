const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');
const getenv = require('getenv');

const app = express();
const port = 8080;

const db_con = {
    host: getenv('MYSQL_HOST'),
    user: getenv('MYSQL_USER'),
    password: getenv('MYSQL_PASSWORD'),
    database: getenv('MYSQL_DATABASE'),
};

const pool = mysql.createPool(db_con);

app.get('/get_user_log', async (req, res) => {
    const mail = req.query.mail;
    const api_token = req.query.api_token
    if (api_token != getenv('API_TOKEN'))
        return res.status(700).json({ error: 'Wrong api token' });
    if (mail === undefined) {
        return res.status(400).json({ error: 'Check the urls parameters' });
    }

    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM users WHERE email = ?', [mail]);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/get_all_challenge', async (req, res) => {
    const type = req.query.type;
    const api_token = req.query.api_token
    if (api_token != getenv('API_TOKEN'))
        return res.status(700).json({ error: 'Wrong api token' });
    if (type === undefined || (type != 'action' && type != 'veritee')) {
        return res.status(400).json({ error: 'Check the urls parameters' });
    }

    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM challenge WHERE TYPE = ?', [type]);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/set_new_user_log', async (req, res) => {
    const email = req.query.email;
    const pseudo = req.query.pseudo;
    const token = req.query.token;
    const password = req.query.password;
    const api_token = req.query.api_token
    if (api_token != getenv('API_TOKEN'))
        return res.status(700).json({ error: 'Wrong api token' });
    if (email === undefined || pseudo === undefined || token === undefined || password === undefined) {
        return res.status(400).json({ error: 'Check the urls parameters' });
    }

    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('INSERT INTO `users`(`email`, `pseudo`, `password`, `token`) VALUES (?, ?, ?, ?)', [email, pseudo, password, token]);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const server = http.createServer(app);
server.listen(port, '0.0.0.0', () => {
    console.log(`API server is running on port ${port}`);
});