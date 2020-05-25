const router = require('express').Router();


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


module.exports = router;