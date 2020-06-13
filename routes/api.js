const router = require('express').Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "111111",
    database: "project_7"
});
connection.connect();

/*var sql = 'SELECT *FROM subject';
connection.query(sql, function (error, rows, fields) {
    if (error) {
        console.log(error);
    }
    for(var i = 0; i < rows.length; i++){
        console.log(rows[i].title + " : " + rows[i].personnel);
      }
  });*/
   
/*var sql = 'UPDATE user SET email="?", point="?" WHERE _id=?';
var params = ['English Communcation', 50, 2];
connection.query(sql, params, function(err, rows, fields){
    if(err) console.log("에러났음" + err);
    console.log("----------------------------");
    console.log(rows);
    console.log("----------------------------");
});*/

var sql = 'SELECT *FROM user';
connection.query(sql, function (error, rows, fields) {
    if (error) {
        console.log(error);
    }
    for(var i = 0; i < rows.length; i++){
        console.log(rows[i].email + " : " + rows[i].point);
      }
  });
  //connection.end();
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

console.log("왜 안되냐,,");


// 유저들 점수 배팅 
router.post('/bettingpoint', (req, res)=>{
    user_point = 0;
    var mysql = 'SELECT *FROM user';

    console.log("1");
    connection.query(mysql, function (error, rows, fields) {
        console.log("2");

        if (error) {
            console.log(error);
        }
        /*for(var i = 0; i < rows.length; i++){
            console.log(rows[i].email + " : " + rows[i].point);
        }*/
        user_point = Number(rows[1].point) ; // 현재 유저의 포인트구하기.
        console.log("현재 보유하고 있는 포인트는" + user_point +"입니다.");
    });
    console.log("3");

    console.log("현재 보유하고 있는 포인트는kk" + user_point +"입니다.");
    var point = req.body.data;


    var sql_ = 'UPDATE user SET point="?" WHERE _id=?';
    var params = [1000-Number(point), 2];
    console.log("4");

    connection.query(sql_, params, function(err, rows, fields){
        if(err) {
            console.log("에러났음" + err);
        }

        console.log("----------------------------");
        console.log(rows);
        
        console.log("----------------------------");
    });

    if (Number(point)>1000 ||Number(point)<0){
        var return_data = "0부터 1000까지의 포인트를 배팅해주세요!"

        res.json({
            "data" : return_data
        })
        return;      
    }
    else if(user_point-Number(point)<0){

        var return_data = "현재 보유하신 포인트보다 많은 포인트를 배팅할 수 없습니다."

        res.json({
            "data" : return_data
        })
        return; 
    }
    console.log("5");
    console.log(point);

    var return_data = point+"만큼의  포인트를 배팅하셨습니다!"

    res.json({
        "data" : return_data
    })
    console.log("시발");

   /* var sql_ = 'UPDATE user SET point="?" WHERE _id=?';
    console.log(point);
    var params = [1000-Number(point), 2];
    console.log(1000-Number(point));
    console.log("시발");*/

    

});




module.exports = router;