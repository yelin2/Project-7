const router = require('express').Router();
 const mysql = require('mysql');
 const database = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "kimecr5p9253!!",
     database: "computer_network_project"
 });
 database.connect();

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


// DB연동 예시 (특정 과목 평균 point)
router.post('/test1', function(req, res){

    var subject_id = req.body.subject_id;
    
    var sql = 'select avg(point) as avg from enrolment where subject_id=?';
    var params = [subject_id];
    console.log(params);
    database.query(sql, params,function(err,result){
        if(err){
            res.json({
                "message" : "DB error"
            })
        }
        else{
            if(result < 0){
                res.json({
                    "message" : "평균이 0미만일수 없습니다."
                })
            }
            else{
                console.log(result);
                res.json({
                    "message" : result[0].avg
                
                })
            }
        }
    })
});


// case2 최대정원에 맞게 자르기
router.post('/test2', function(req, res){

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
                var sql_='select user_id,point from enrolment where subject_id=? order by point desc limit ?';
                database.query(sql_,[_id,result[0].num],function(err_,result_){
                    /*
                    for(var i=0;i<result_.length;i++){
                        console.log(result_[i].user_id,result_[i].point);
                    }
                    */
                    res.json({
                        "message": result_
                    })
                    
                });
                
            }
        }
    })
});


module.exports = router;