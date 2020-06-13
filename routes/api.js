const router = require('express').Router();

// const mysql = require('mysql');
// const database = mysql.createConnection({
//     host: "localhost",
//     user: "mysql 사용자 이름",
//     password: "mysql 비밀번호",
//     database: "PROJECT_7"
// });
// database.connect();


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


// DB연동 예시 (유저가 DB에 있는지)
// router.post('/user', function(req, res){
//
//     var email = req.body.email;
//
//     var sql = 'SELECT * FROM User where email = ?';
//     var params = [email];
//
//     database.query(sql, params,function(err,result){
//         if(err){
//             res.json({
//                 "message" : "DB error"
//             })
//         }
//         else{
//
//             if(result.length == 0){
//                 res.json({
//                     "message" : "유저정보 조회 실패"
//                 })
//             }
//             else{
//                 res.json({
//                     "message" : "유저정보 조회 성공"
//                 })
//             }
//         }
//     })
// });

// 과목명, 과목소개, 정원
router.post('/subject',function(req, res){
    // console.log(req.body.data);
    var sql = 'SELECT * FROM subject';

    database.query(sql, function(err,result){
        if(err){
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



module.exports = router;