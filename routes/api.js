const router = require('express').Router();
const cookie = require('cookie');

const mysql = require('mysql');
const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "PROJECT_7"
});
database.connect();

let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");

// http://localhost:3000/api 이후 부분의 라우팅

router.post('/login', (req, res)=>{
    // 1. data 받아오기
    var email = req.body["email"];
    var password = req.body["password"];
    var token = "";

    // 2. DB랑 정보 일치하는지 확인
    database.query("SELECT * FROM User where email = ? and password = ?",[email, password], function(err, res1){
        if(res1.length==0){
            res.json({
                "data": 0
            })
        }else{

            const token = jwt.sign(
                {
                    _id : res1[0]._id,
                    email: res1[0].email
                },
                secretObj.secret,
                {
                    expiresIn: '30 days'
                }
                );

            res.json({
                "data" : token
            })
        }
    });
});


router.get('/user', (req, res)=>{

    const token = cookie.parse(req.headers.cookie).user_info;

    const tokenInfo = jwt.verify(token, secretObj.secret);

    if(!tokenInfo){
        res.json({
            isSuccess:false,
            code: 301,
            message:"유효하지 않은 토큰입니다"
        });
    }

    var sql = 'SELECT _id, email, point FROM User where _id = ?';
    var param = [tokenInfo._id];

    database.query(sql,param, function(err,db_result){
        if(err){
            res.json({
                "message" : "DB error"
            })
        }
        else{

            let result = db_result[0];

            var sql2 = 'SELECT subject_id,point FROM enrolment where user_id = ?';
            var param2 = [tokenInfo._id];

            database.query(sql2,param2, function(err,db_result2){
                if(err){
                    res.json({
                        "message" : "DB error"
                    })
                }
                else{

                    result["enroll_info"] = db_result2;

                    res.json({
                        "data" : result
                    })

                }
            });
        }
    });

});




// 과목
router.get('/subject',function(req, res){
    // console.log(req.body.data);
    var sql = 'SELECT s._id, s.title, s.content, s.personnel, t.total as enroll_total, ROUND (a.avg,1) as enroll_avg\n' +
        'FROM\n' +
        'subject AS s\n' +
        '\n' +
        'JOIN\n' +
        '(\n' +
        'SELECT count(user_id) as total, subject_id\n' +
        'FROM\n' +
        'enrolment\n' +
        'GROUP BY subject_id\n' +
        ') AS t\n' +
        'ON s._id = t.subject_id\n' +
        '\n' +
        'JOIN\n' +
        '(\n' +
        'SELECT avg(point) as avg, subject_id\n' +
        'FROM\n' +
        'enrolment\n' +
        'GROUP BY subject_id\n' +
        ') AS a\n' +
        'ON s._id = a.subject_id';

    database.query(sql, function(err,result){
        if(err){
            res.json({
                "message" : "DB error"
            })
        }
        else{

            res.json({
                "subject" : result
            })
        }
    })
});

router.post('/betting', (req, res)=>{

    const token = cookie.parse(req.headers.cookie).user_info;

    const tokenInfo = jwt.verify(token, secretObj.secret);

    if(!tokenInfo){
        res.json({
            isSuccess:false,
            code: 301,
            message:"유효하지 않은 토큰입니다"
        });
    }

    let {subject_id, bettingpoint} = req.body;
    const user_id = tokenInfo._id;

    bettingpoint = Number(bettingpoint);

    var sql = 'SELECT point FROM user where _id = ?';
    var param = [user_id];

    database.query(sql,param, function(err,db_result){
        if(err){
            res.json({
                "code" : 102,
                "message" : "DB error"
            })
        }
        else{

            var current_point = Number(db_result[0].point);

            if(current_point - bettingpoint < 0 ){
                res.json({
                    "code" : 101,
                    "message" : "현재 소유하고있는 포인트보다 더 많은 포인트를 배팅할수 없습니다."
                })
            }
            else{

                var sql2 = 'UPDATE user SET point= ? WHERE _id= ?';
                var param2 = [current_point-bettingpoint, user_id];


                database.query(sql2,param2, function(err,db_result2){
                    if(err){
                        res.json({
                            "code" : 102,
                            "message" : "DB error"
                        })
                    }
                    else{

                        var sql3 = 'INSERT INTO Enrolment(user_id,subject_id,point)\n' +
                            'VALUES (?,?,?);';
                        var param3 = [user_id,subject_id,bettingpoint];


                        database.query(sql3,param3, function(err,db_result3){
                            if(err){
                                res.json({
                                    "code" : 102,
                                    "message" : "DB error"
                                })
                            }
                            else{
                                res.json({
                                    "code" : 201,
                                    "message" : "배팅이 정상적으로 완료되었습니다."
                                })
                            }
                        });
                    }
                });
            }
        }
    });
});


router.post('/finish_find', function(req, res){

    var _id = req.body.subject_id;

    var sql = 'select personnel as num from subject where _id=?';
    var params = [_id];

    database.query(sql, params,function(err,result){
        if(err){
            res.json({
                "message" : "DB error"
            })
        }
        else{
            if(result.length < 0){
                res.json({
                    "message" : "정원이 0미만일수 없습니다."
                })
            }
            else{
                var sql_='select u.email,e.point\n' +
                    'from\n' +
                    'enrolment as e\n' +
                    'JOIN\n' +
                    'user as u\n' +
                    'ON e.user_id = u._id\n' +
                    'where e.subject_id=? order by point desc limit ?';
                database.query(sql_,[_id,result[0].num],function(err_,result_){

                    res.json({
                        "message": result_
                    })

                });

            }
        }
    })
});


module.exports = router;