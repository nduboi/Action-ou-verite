const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const challengeRoutes = require('./src/routes/challenge');

const app = express();
app.use(bodyParser.json());
app.use(cors());

authRoutes(app, bcrypt, jwt);
challengeRoutes(app, bcrypt, jwt);

const server = http.createServer(app);
server.listen(8080, '0.0.0.0', () => {
    console.log(`API server is running on port 8080`);
});