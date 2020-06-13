function bettingpoint(index) {

    var bettingpoint = document.getElementsByClassName('enroll_input')[index].value;
    var subjectId = document.getElementsByClassName('subject_id')[index].value;

    console.log(bettingpoint);
    console.log(document.getElementsByClassName('subject_id')[index].innerHTML);
}