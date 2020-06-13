const router = require('express').Router();

const mysql = require("mysql");
let client = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456789qwer!",
    database: "project7"
  })

  let jwt = require("jsonwebtoken");
  let secretObj = require("../config/jwt");

  client.connect(function(err){
    if(!err){
      console.log("Database is connected");
    }else{
      console.log("Error connecting database...nn: " + err);
    }
  })

// http://localhost:3000/api 이후 부분의 라우팅


router.post('/test',(req, res)=>{

    //req.body를 통해 프론트에서보낸 데이터를 받습니다
    var data = req.body.data;

    var return_data = data+"라는 데이터 잘 받았습니다";

    //res.json을 통해 json형식으로 서버 -> 프론트로 데이터 전달
    res.json({
        "data" : return_data
    })
});

router.post('/login', (req, res)=>{
    // 1. data 받아오기
    var email = req.body["email"];
    var password = req.body["password"];
    var token = "";

    // 2. DB랑 정보 일치하는지 확인
    client.query("SELECT * FROM User where email = ? and password = ?",[email, password], function(err, res1){
        if(res1.length==0){
            res.json({
                "data": 0
            })
        }else{
            token = jwt.sign({
                email: res1.email,
                password: res1.password
            },
            secretObj.secret,
            {expiresIn: '5m'
            })

            res.json({
                "data" : token
            })



        } 
    });

    /* if(!token){
        console.log(token);
        res.json({
            "data" : token
        })
    } */
    
})

module.exports = router;