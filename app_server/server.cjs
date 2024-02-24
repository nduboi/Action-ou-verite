const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const nodemailer = require("nodemailer");
const getenv = require('getenv');
const mysql = require('mysql2/promise');
const { json } = require("express");
import('node-fetch').then(fetch => {
    // Your code that uses fetch
}).catch(err => {
    // Handle errors
});
const db_con = {
    host: getenv('MYSQL_HOST'),
    user: getenv('MYSQL_USER'),
    password: getenv('MYSQL_PASSWORD'),
    database: getenv('MYSQL_DATABASE'),
};

const pool = mysql.createPool(db_con);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: getenv('MAIL_ADRESS'),
        pass: getenv('MAIL_PASSWORD')
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
})

app.get("/player", (req, res) => {
    res.sendFile(__dirname + "/src/choose_player.html");
})

app.get("/game", (req, res) => {
    res.sendFile(__dirname + "/src/game.html");
})

app.get("/rules", (req, res) => {
    res.sendFile(__dirname + "/src/rules.html");
})


app.get("/build/css/main.css", (req, res) => {
    res.sendFile(__dirname + "/src/build/css/main.css");
})

async function get_user_from_api() {
    try {
        const response = await fetch('http://api_js:8080/get_all_user');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function get_challenge_from_api() {
    try {
        const response = await fetch('http://api_js:8080/get_all_challenge');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

io.on("connection", (socket) => {
    socket.on("ask_bdd_challenge", (info) => {
        get_challenge_from_api()
        .then(data => {
            console.log(data);
            console.log(Object.keys(data).length);
            io.emit("answer_server :"+info.token, data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    })
})

var port = 80;

http.listen(port, () => {
    console.log("Serveur OK");
})