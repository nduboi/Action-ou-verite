const { login, register } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const getenv = require('getenv');

module.exports = function(app, bcrypt, jwt) {
    app.post('/login', async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        if (email === undefined || password === undefined) {
            res.status(400).json({ error: 'Check the urls parameters' });
            return false;
        }

        try {
            let token = await login(email, password, res, jwt);
            if (token === false)
                return;
            res.status(200).json({
                status: 'Success',
                token: token
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.post('/register', async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        if (email === undefined || password === undefined || username === undefined) {
            res.status(400).json({ error: 'Check the urls parameters' });
            return false;
        }

        try {
            let token = await register(email, password, username, res, jwt);
            if (token !== false) {
                res.status(200).json({ status: 'Success', token: token });
                return;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    app.get('/checkToken', async (req, res) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        try {
            const decoded = jwt.verify(token, getenv('SECRET_KEY_JWT'));
            res.status(200).json({ status: 'Success' });
        } catch (error) {
            res.status(401).json({ error: 'Token expired' });
        }
    });
};