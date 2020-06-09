const router = require('express').Router();
const fs = require('fs');

router.get('/',(req, res)=>{
    fs.readFile("./views/index.html", "utf-8", (err, data)=>{
        res.type('text/html');
        res.send(data);
    });
});

router.get('/search',(req, res)=>{
    fs.readFile("./views/search.html", "utf-8", (err, data)=>{
        res.type('text/html');
        res.send(data);
    });
});

module.exports = router;