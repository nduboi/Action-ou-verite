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

app.get('/get_all_user', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM users');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/get_all_challenge', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM challenge');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create HTTP server and listen on port 8080
const server = http.createServer(app);
server.listen(port, '0.0.0.0', () => {
    console.log(`API server is running on port ${port}`);
});