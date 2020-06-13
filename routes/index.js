const router = require('express').Router();
const fs = require('fs');
var cookie = require('cookie');

router.get('/',(req, res)=>{
    fs.readFile("./views/index.html", "utf-8", (err, data)=>{
        res.type('text/html');
        res.send(data);
    });
});

router.get('/login',(req, res)=>{
    fs.readFile("./views/login.html", "utf-8", (err, data)=>{
        res.type('text/html');
        res.send(data);
    });
});

router.get('/main',(req, res)=>{
    console.log(req.headers.cookie);
    fs.readFile("./views/main.html", "utf-8", (err, data)=>{
        res.type('text/html');
        res.send(data);
    });
});

module.exports = router;