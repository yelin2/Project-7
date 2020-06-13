const express = require('express');
const app = express();
const http = require('http').Server(app);

//포트설정
let PORT = 3000;

//기타모듈 설정
const indexRouter = require('./routes/index');

const apiRouter = require('./routes/api');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(cookieParser());
///////////// front-end routing (html 파일 띄워주는 곳)
app.use('/',indexRouter);

app.use('/serach',indexRouter);
///////////// server routing (백엔드 api 들어가는 곳)
app.use('/api',apiRouter);



///////////////////
http.listen(PORT,()=>{
    console.log(PORT+'번 포트에서 Connected!');
});