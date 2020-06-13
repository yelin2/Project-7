const router = require('express').Router();
const mysql = require('mysql');
const cookie = require('cookie');
let client = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sky01015",
    database: "user_db"
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

    console.log(data);

    var return_data = data+"라는 데이터 잘 받았습니다";

    //res.json을 통해 json형식으로 서버 -> 프론트로 데이터 전달
    res.json({
        "data" : return_data
    })

});

router.post('/login', (req, res)=>{
    // 1. data 받아오기
    var email = req.body.email;
    var password = req.body.password;

    var token = "";

    // 2. DB랑 정보 일치하는지 확인
    client.query("SELECT * FROM User where email = ? and password = ?",[email, password], function(err, res1){
        if(res1.length==0){
            res.json({
                "data": 0
            })
        }else{
            token = jwt.sign({
                "email": res1.email,
                "password": res1.password
            },
            secretObj.secret,
            {expiresIn: '5m'
            })

            res.json({
                "data" : token
            })
        }
    });    
})

// DB연동 예시 (유저가 DB에 있는지)
router.post('/user', function(req, res){

    var email = req.body.email;

    var sql = 'SELECT * FROM User where email = ?';
    var params = [email];

    client.query(sql, params,function(err,result){
        if(err){
            res.json({
                "message" : "DB error"
            })
        }
        else{

            if(result.length == 0){
                res.json({
                    "message" : "유저정보 조회 실패"
                })
            }
            else{
                res.json({
                    "message" : "유저정보 조회 성공"
                })
            }
        }
    })
});

router.post('/user_find',(req,res)=>{
    var data = req.body.data;
    var cookie_Data = cookie.parse(data);
    var token=cookie_Data["user_info"];
    console.log(token);
    var decoded={};
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        });
    }else{
            decoded=jwt.verify(token,secretObj.secret);
    }
    console.log(decoded);

    var param = [decoded.email];
    console.log(param);
    var sql = 'select e._id,u.email,s.title,u.point from user as u left join enrolment as e on e.user_id = u._id left join Subject as s on e.subject_id = s._id';
    client.query(sql,function(err,results){
        if(err){
            res.json({
                'message':err
            });
        }
        else{
            var string=JSON.stringify(results);
            const ans=JSON.parse(string);
            sql = 'select _id from user where email = ?';
            client.query(sql,param,function(err,results){
                if(err)
                {
                    res.json({
                        'message':err
                    });
                }
                else{
                    //console.log(ans);
                    string = JSON.stringify(results);
                    var json = JSON.parse(string);
                    //console.log(json);
                    var email = json.email;
                    var datas=[];
                    //console.log(email);
                    for(var i=0;i<ans.length;i++)
                    {
                        if(ans[i].email == email)
                        {
                            datas.push(ans[i]);
                        }
                    }
                    console.log(datas);
                    res.json(datas);
                }
            })
        }
    })
});


module.exports = router;