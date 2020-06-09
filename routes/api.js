const router = require('express').Router();
const mysql = require('mysql');
const database = mysql.createConnection({
    host: "localhost",
    post: "3306",
    user: "root",
    password: "sky01015",
    database: "user_db"
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

router.post('/user_find',(req,res)=>{
    console.log(req.body);
    var index=req.body.email;
    const param=[index];
    var sql = 'select e._id,u.email,s.title,u.point from user as u left join enrolment as e on e.user_id = u._id left join Subject as s on e.subject_id = s._id';
    database.query(sql,function(err,results){
        if(err){
            res.json({
                'message':err
            });
        }
        else{
            console.log(results);
            var string=JSON.stringify(results);
            const ans=JSON.parse(string);
            sql = 'select email from user where _id = ?';
            database.query(sql,param,function(err,results){
                if(err)
                {
                    res.json({
                        'message':err
                    });
                }
                else{
                    console.log(ans);
                    string = JSON.stringify(results);
                    var json = JSON.parse(string);
                    console.log(json);
                    var email = json[0].email;
                    var datas=[];
                    console.log(email);
                    for(var i=0;i<ans.length;i++)
                    {
                        console.log(ans[i]);
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