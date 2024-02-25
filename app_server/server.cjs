const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const getenv = require('getenv');
const { json } = require("express");
var bcrypt = require('bcryptjs');
import('node-fetch').then(fetch => {
    // Your code that uses fetch
}).catch(err => {
    // Handle errors
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
})

app.get("/player", (req, res) => {
    res.sendFile(__dirname + "/src/choose_player.html");
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/src/connexion.html");
})

app.get("/rules", (req, res) => {
    res.sendFile(__dirname + "/src/rules.html");
})

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/src/inscription.html");
})

app.get("/game", (req, res) => {
    res.sendFile(__dirname + "/src/game.html");
})

app.get("/account", (req, res) => {
    res.sendFile(__dirname + "/src/account.html");
})

app.get("/rules", (req, res) => {
    res.sendFile(__dirname + "/src/rules.html");
})


app.get("/build/css/main.css", (req, res) => {
    res.sendFile(__dirname + "/src/build/css/main.css");
})

async function get_user_from_api(mail) {
    try {
        const response = await fetch('http://api_js:8080/get_user_log?mail='+mail+'&api_token='+getenv('API_TOKEN'));
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function get_pseudo_from_api_with_token(token) {
    try {
        const response = await fetch('http://api_js:8080/get_user_log?token='+token+'&api_token='+getenv('API_TOKEN'));
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function send_mail_verif(token) {
    try {
        const response = await fetch('http://api_js:8080/send_verif_mail?token='+token+'&api_token='+getenv('API_TOKEN'));
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}


async function get_pseudo_from_api(pseudo) {
    try {
        const response = await fetch('http://api_js:8080/get_user_log?pseudo='+pseudo+'&api_token='+getenv('API_TOKEN'));
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function get_challenge_from_api(type) {
    try {
        const response = await fetch('http://api_js:8080/get_all_challenge?type='+type+'&api_token='+getenv('API_TOKEN'));
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function set_new_user_api(email, pseudo, password, token) {
    try {
        const response = await fetch('http://api_js:8080/set_new_user_log?email='+email+'&pseudo='+pseudo+'&password='+password+'&token='+token+'&api_token='+getenv('API_TOKEN'));
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
        get_challenge_from_api(info.type)
        .then(data => {
            io.emit("answer_server :"+info.token, data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    })
    socket.on("send_login", (data) => {
        get_user_from_api(data.email)
        .then(info => {
            if (Object.keys(info).length == 1) {
                if (bcrypt.compareSync(data.password, info[0].password)) {
                    io.emit("result_log :" + data.token, {status : "success", token : info[0].token})
                } else {
                    io.emit("result_log :" + data.token, {status : "error", message : "Wrong password"})
                }
            } else {
                io.emit("result_log :" + data.token, {status : "error", message : "Wrong login"})
            }
        })
    });
    socket.on("create_user", (data) => {
        get_user_from_api(data.email)
        .then(info => {
            if (Object.keys(info).length > 0) {
                io.emit("anwser_bdd_account :"+data.token, {status : "error", message : "This email alredy exist"});
            } else {
                get_pseudo_from_api(data.pseudo)
                .then(info => {
                    if (Object.keys(info).length > 0) {
                        io.emit("anwser_bdd_account :"+data.token, {status : "error", message : "This pseudo alredy exist"});
                    } else {
                        var salt = bcrypt.genSaltSync(10);
                        var hash_pass = bcrypt.hashSync(data.password, salt);
                        var hash_token = bcrypt.hashSync(data.token, salt);
                        set_new_user_api(data.email, data.pseudo, hash_pass, hash_token)
                        .then (info => {
                            send_mail_verif(hash_token)
                            .then(into => {
                                io.emit("anwser_bdd_account :"+data.token, {status : "success", token : hash_token});
                            }).catch(error => {
                                io.emit("anwser_bdd_account :"+data.token, {status : "error", message : error});
                            })
                        }).catch(error => {
                            io.emit("anwser_bdd_account :"+data.token, {status : "error", message : error});
                        });
                    }
                });
            }
        });
    })
    socket.on("get_info_user", (data) => {
        get_pseudo_from_api_with_token(data.token)
        .then(info => {
            if (Object.keys(info).length == 1) {
                socket.emit("awnser_server_data_user :"+data.token, {status : "success", pseudo : info[0].pseudo})
            } else {
                socket.emit("awnser_server_data_user :"+data.token, {status : "error", message : "No users found"})
            }
        })
        .catch(error => {
            socket.emit("awnser_server_data_user :"+data.token, {status : "error", message : "There is a error with the data"})
        });
    })
})

var port = 80;

http.listen(port, () => {
    console.log(`APP server is running on port ${port}`);
})