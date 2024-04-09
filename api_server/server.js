const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');
const getenv = require('getenv');
const nodemailer = require("nodemailer");

const app = express();
const port = 8080;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: getenv('MAIL_ADRESS'),
        pass: getenv('MAIL_PASSWORD')
    }
});

async function send_verif_mail(email_adress, token) {
    const info = await transporter.sendMail({
      from: '"Avnduboi" <noreply@nduboi.com>',
      to: email_adress,
      subject: "Check your account ✔",
      html: `<h1>Hello, to check your account click <a href="http://localhost/check_account&${token}">here</a></h1>`,
    });
}

const db_con = {
    host: getenv('MYSQL_HOST'),
    user: getenv('MYSQL_USER'),
    password: getenv('MYSQL_PASSWORD'),
    database: getenv('MYSQL_DATABASE'),
};

const pool = mysql.createPool(db_con);

app.get('/get_user_log', async (req, res) => {
    const mail = req.query.mail;
    const pseudo = req.query.pseudo;
    const user_token = req.query.token;
    const api_token = req.query.api_token;

    if (api_token != getenv('API_TOKEN'))
        return res.status(700).json({ error: 'Wrong api token' });
    if (mail === undefined && pseudo === undefined && user_token === undefined) {
        return res.status(400).json({ error: 'Check the urls parameters' });
    }
    if (mail != undefined) {
        try {
            const connection = await pool.getConnection();
            const [rows, fields] = await connection.execute('SELECT * FROM users WHERE email = ?', [mail]);
            connection.release();
            res.json(rows);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        if (pseudo != undefined) {
            try {
                const connection = await pool.getConnection();
                const [rows, fields] = await connection.execute('SELECT pseudo, email FROM users WHERE pseudo = ?', [pseudo]);
                connection.release();
                res.json(rows);
            } catch (error) {
                console.error('Error fetching data:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        } else {
            if (user_token != undefined) {
                try {
                    const connection = await pool.getConnection();
                    const [rows, fields] = await connection.execute('SELECT pseudo, email FROM users WHERE token = ?', [user_token]);
                    connection.release();
                    res.json(rows);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    res.status(500).json({ error: 'Internal server error <3' });
                }
            }
        }
    }
});

app.get('/send_verif_mail', async (req, res) => {
    const token = req.query.token;
    const api_token = req.query.api_token

    if (api_token != getenv('API_TOKEN'))
        return res.status(700).json({status: 'Wrong api token' });
    if (token === undefined) {
        return res.status(400).json({status: 'Check the urls parameters' });
    }
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT email, status_verif FROM users WHERE token = ?', [token]);
        connection.release();
        if (Object.keys(rows).length == 1) {
            if (rows[0].status_verif == 0) {
                send_verif_mail(rows[0].email, token);
                res.json({status: 'Success'});
            } else {
                res.json({status: 'Already check'});
            }
        } else {
            res.json({status: 'Wrong token'});
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({status: 'Internal server error' });
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

app.get('/set_challenge', async (req, res) => {
    const defi = req.query.defi;
    var defi_type = "nothing"
    const type = req.query.type;
    const token = req.query.token;
    const api_token = req.query.api_token
    if (api_token != getenv('API_TOKEN'))
        return res.status(700).json({ error: 'Wrong api token' });
    if ((defi === undefined || type === undefined || token === undefined) && (type != 1 && type != 2)) {
        return res.status(400).json({ error: 'Check the urls parameters' });
    }

    if (type == 1) {
        defi_type = "action"
    } else {
        defi_type = "veritee"
    }
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('INSERT INTO `challenge`(`TYPE`, `value`) VALUES (?, ?)', [defi_type, defi]);
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