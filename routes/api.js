const router = require('express').Router();
const mysql = require('mysql');
const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "wogur121",
    database: "project_7"
});
database.connect();

//http://localhost:3000/api 이후 부분의 라우팅


router.post('/test',(req, res)=>{

    //req.body를 통해 프론트에서보낸 데이터를 받습니다
    var data = req.body.data;
    console.log(1);
    console.log(data);

    var return_data = data+"라는 데이터 잘 받았습니다";

    //res.json을 통해 json형식으로 서버 -> 프론트로 데이터 전달
    res.json({
        "data" : return_data
    })

});


// DB연동 예시 (유저가 DB에 있는지)
router.post('/user', function(req, res){

    var email = req.body.email;

    var sql = 'SELECT * FROM User where email = ?';
    var params = [email];

    database.query(sql, params,function(err,result){
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



// 과목명, 과목소개, 정원
router.post('/subject',function(req, res){
    // console.log(req.body.data);
    var sql = 'SELECT * FROM subject';

    database.query(sql, function(err,result){
        if(err){
            console.log(1);
            res.json({
                "message" : "DB error"
            })
        }
        else{
            if(result.length == 0){
                res.json({
                    "message" : "과목조회 실패"
                })
            }
            
            else{
                console.log(result);
                res.json({
                    "message" : result
                })
            }
            
            
        }
    })

});

// //과목에 배팅한 사람수
router.post('/betting',function(req, res){
    var _id = req.body.subject_id;
    var sql = 'SELECT user_id FROM enrolment WHERE subject_id = ?';
    var params = [_id];

    database.query(sql, params, function(err,result){
        if(err){
            res.json({
                "message" : "DB error"
            })
        }
        else{
            if(result.length < 0){
                res.json({
                    "message" : "배팅인원이 0미만일수 없습니다."
                })
            }
            else{
                console.log(_id);
                console.log(result.length);
                res.json({
                    "message" : result.length
                })
            }
        }
    })
});

//과목별 1,2,3등 배팅점수
router.post('/bettingpoint', function(req, res){

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
                    "message" : "배팅인원이 0미만일수 없습니다."
                })
            }
            else{
                var sql_='select user_id,point from enrolment where subject_id=? order by point desc limit ?';
                var params = [_id,result[0].num];
                database.query(sql_,params,function(err_,result_){
                    
                    for(var i=0;i<result_.length;i++){
                        console.log(result_[i].point);
                    }
                    
                    res.json({
                        "message": result_
                    })
                });
            }
        }
    })
});


module.exports = router;