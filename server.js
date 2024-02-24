const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const nodemailer = require("nodemailer");
const getenv = require('getenv');

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

io.on("connection", (socket) => {
    socket.on(`Connection`, (info) => {})
})
var port = 80;
http.listen(port, () => {
    console.log("Serveur OK");
})