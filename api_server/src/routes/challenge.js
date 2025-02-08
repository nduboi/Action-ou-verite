const jwt = require('jsonwebtoken');
const getenv = require('getenv');
const { addChallenge, getChallenge, getAllChallenge } = require('../middleware/challenge');

module.exports = function(app, bcrypt, jwt) {
    app.post('/addChallenge', async (req, res) => {
        const challenge = req.body.challenge;
        let type = req.body.type;
        const token = req.headers['authorization'];
        // TODO: Check if the token is valid middleware
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        let username;
        try {
            const decoded = jwt.verify(token, getenv('SECRET_KEY_JWT'));
            username = decoded.username;
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(401).json({ error: 'Token expired' });
            return;
        }
        if (challenge === undefined || type === undefined) {
            res.status(400).json({ error: 'Please fill all input' });
            return false;
        }
        try {
            if (type === "1")
                type = "action";
            else
                type = "veritee";
            if (await addChallenge(challenge, type, username, res) === false) {
                return;
            }
            res.json({ status: 'Success' });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    app.get('/getChallenge', async (req, res) => {
        try  {
            let type = req.query.type;
            if (type === undefined) {
                res.status(400).json({ error: 'Please fill all input' });
                return false;
            }
            if (type === "1")
                type = "action";
            else
                type = "veritee";
            let challenge = await getChallenge(type);
            res.status(200).json({ "value": challenge });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    app.get('/getAllChallenge', async (req, res) => {
        try  {
            let challenge = await getAllChallenge();
            res.status(200).json(challenge);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};