
let enroll_info = new Array();

function me() {

    // 입력받은 email, password 맞는지 확인
    var url = 'http://172.20.10.4:3000/api/user';

    sendAjax_me(url);

}

function sendAjax_me(url){
    $.ajax({
        type:"GET",
        url : url,
        async: false,

        //성공적으로 서버에서 응답이 왔을때
        success : (result,status)=>{

            result = result.data;

            if(result.email == 'admin'){

                document.getElementById('admin').style.display='flex';
                document.getElementById('user').style.display='none';

            }
            else{

                enroll_info = result.enroll_info;

                const header_area = document.getElementById('user');

                header_area.innerHTML = `
                <div class="logo">
                    <img id="logo_img" src="http://www.kau.ac.kr/images/common/logo.gif" alt="한국한공대학" class="logo" />
                </div>
            
                <div class="logo">
                    <img id="logo_text" src="http://su.kau.ac.kr/images/new_su/assitance_imgtxt.gif" alt="수강신청"/>
                </div>
            
            
                <div id="temp"></div>
            
                <div id="name">${result.email}님</div>
                <div id="point">수강신청 포인트 : ${result.point}/1000</div>
                <div id="enroll">신청현황</div>
                <a id="logout_link" href="javascript:void(0);onclick=logout()">
                    <div id="logout">로그아웃</div>
                </a>
                `;

                document.getElementById('admin').style.display='none';
                document.getElementById('user').style.display='flex';
            }

        },

        //서버와 데이터주고받기가 실패했을때
        error: (request,status,error)=>{
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}


function subject() {

    // 입력받은 email, password 맞는지 확인
    var url = 'http://172.20.10.4:3000/api/subject';

    sendAjax_subject(url);

}

function sendAjax_subject(url){
    $.ajax({
        type:"GET",
        url : url,
        async: false,

        //성공적으로 서버에서 응답이 왔을때
        success : (result,status)=>{

            result = result.subject;

            var main_area = document.getElementById('main');

            var input_data ='';

            for(var i=0; i<result.length; i++){

                let status = 0;
                var data='';

                for(var j=0;j<enroll_info.length;j++){
                    if(enroll_info[j].subject_id == result[i]._id){
                        status=1;
                        break;
                    }
                }

                if(status==0){
                    data = `
                <div class="content_all">
                    <div class="content_header">
                        <div class="header_top">
                            <div class="content_title">
                                과목명 (과목코드)
                            </div>
            
                            <div class="temp"></div>
            
                            <div class="content_enroll">
                                신청인원 / 정원
                            </div>
                        </div>
            
                        <div class="header_bottom">
                            <div class="content_title">
                                ${result[i].title}&nbsp;(<span class="subject_id">${result[i]._id}</span>)
                            </div>
            
                            <div class="temp"></div>
            
                            <div class="content_enroll">
                                ${result[i].enroll_total} / ${result[i].personnel}
                            </div>
                        </div>
            
                    </div>
            
                    <div class="content_box">
            
                        <div class="content_left">
                            ${result[i].content}
                        </div>
            
                        <div class="content_right">
                            <div>평균 배팅점수 : ${result[i].enroll_avg}</div>
            
                            <div id="enroll_boox" class="enroll_box enroll_yet">
                                <input class="enroll_input" type="text">
                                <button class="enroll_button" onclick="bettingpoint(${i})">신청하기</button>
                            </div>
                            
                            <div class="enroll_result enroll_done">
                                <div>신청마감 <button class="result" onclick="finish_find(${result[i]._id})">결과확인</button></div>
                            </div>
                        </div>
            
                    </div>
                </div>
                `;
                }
                else{
                    data = `
                <div class="content_all">
                    <div class="content_header">
                        <div class="header_top">
                            <div class="content_title">
                                과목명 (과목코드)
                            </div>
            
                            <div class="temp"></div>
            
                            <div class="content_enroll">
                                신청인원 / 정원
                            </div>
                        </div>
            
                        <div class="header_bottom">
                            <div class="content_title">
                                ${result[i].title}&nbsp;(<span class="subject_id">${result[i]._id}</span>)
                            </div>
            
                            <div class="temp"></div>
            
                            <div class="content_enroll">
                                ${result[i].enroll_total} / ${result[i].personnel}
                            </div>
                        </div>
            
                    </div>
            
                    <div class="content_box">
            
                        <div class="content_left">
                            ${result[i].content}
                        </div>
            
                        <div class="content_right">
                            <div>평균 배팅점수 : ${result[i].enroll_avg}</div>
            
                            <div id="enroll_boox" class="enroll_box enroll_done">
                                <input class="enroll_input" type="hidden">
                                <div>신청완료</div>
                            </div>
                            <div class="enroll_result enroll_done">
                                <div>신청마감 <button class="result" onclick="finish_find(${result[i]._id})">결과확인</button></div>
                            </div>
                        </div>
            
                    </div>
                </div>
                `;
                }



                input_data = input_data + data;
            }

            main_area.innerHTML = input_data;

        },

        //서버와 데이터주고받기가 실패했을때
        error: (request,status,error)=>{
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}






function bettingpoint(index) {

    console.log(index);
    var bettingpoint = document.getElementsByClassName('enroll_input')[index].value;
    var subjectId = document.getElementsByClassName('subject_id')[index].innerHTML;

    var url = 'http://172.20.10.4:3000/api/betting';

    sendAjax_bettingpoint(url,subjectId, bettingpoint);
}

function sendAjax_bettingpoint(url,subjectId, bettingpoint){
    $.ajax({
        type:"POST",
        dataType: 'json',
        url : url,
        data : {
            'subject_id' : subjectId,
            'bettingpoint': bettingpoint,
        },
        async: false,

        //성공적으로 서버에서 응답이 왔을때
        success : (result,status)=>{

            if(result.code == 101){
                alert(result.message);
                location.reload(true);
            }

            else if (result.code == 201){
                alert(result.message);
                location.reload(true);
            }

        },

        //서버와 데이터주고받기가 실패했을때
        error: (request,status,error)=>{
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

const deleteCookie = function(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
};

const logout = () => {
    deleteCookie('user_info');
    alert("로그아웃 합니다.");
    location.href='/';
};

const enroll_finish = () => {
    document.getElementsByClassName('enroll_box')[0].style.display='none';
    document.getElementsByClassName('enroll_box')[1].style.display='none';
    document.getElementsByClassName('enroll_box')[2].style.display='none';

    document.getElementsByClassName('enroll_result')[0].style.display='block';
    document.getElementsByClassName('enroll_result')[1].style.display='block';
    document.getElementsByClassName('enroll_result')[2].style.display='block';
};

const finish_find = (index) => {

    var url = 'http://172.20.10.4:3000/api/finish_find';

    sendAjax_finish_find(url,index);

};


function sendAjax_finish_find(url,subjectId){
    $.ajax({
        type:"POST",
        dataType: 'json',
        url : url,
        data : {
            'subject_id' : subjectId
        },
        async: false,

        //성공적으로 서버에서 응답이 왔을때
        success : (result,status)=>{

            result = result.message;

            var text_result = '--------- 수강신청 결과 ---------\n\n';

            for(var i=0; i<result.length; i++){
                var text = "학번 : "+result[i].email+" 배팅점수 : "+result[i].point+"\n";
                text_result = text_result + text;
            }

            alert(text_result);

        },

        //서버와 데이터주고받기가 실패했을때
        error: (request,status,error)=>{
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}


me();
subject();