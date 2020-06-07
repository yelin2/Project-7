//dsfdfdf
const express = require('express');
const app = express();
const http = require('http').Server(app);

//포트설정
let PORT = 3000;

//기타모듈 설정

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

///////////// front-end routing (html 파일 띄워주는 곳)

const indexRouter = require('./routes/index');
app.use('/',indexRouter);

///////////// server routing (백엔드 api 들어가는 곳)

const apiRouter = require('./routes/api');
app.use('/api',apiRouter);

///////////////////
http.listen(PORT,()=>{
    console.log(PORT+'번 포트에서 Connected!');
});