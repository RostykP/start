/**
 * Created by Slavic_Gutnyk on 6/27/2016.
 */
$(document).ready(function () {

    //get list of tasks
    var tasks= getResp({"sid":$.cookie('sid')},'task/list/');
    if(tasks){
        $.each( tasks.list, function( i ) {
            // alert( a.list[i].id );
            var date = new Date(tasks.list[i].ts);
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            var sec = date.getSeconds().toString();
            sec = sec.length > 1 ? sec : '0' + sec;
            var newDate = date.getFullYear()+"-"+month+"-"+day+" "+date.getHours()+":"+date.getMinutes()+":"+sec;
            $("#task_list").append("<div class='task-list-class' id='"+tasks.list[i].id+"' ><span>"+tasks.list[i].id+"</span><span>"+newDate+"</span></div>");
        });
    }


});

//get task
$(document).on("click",".task-list-class",function() {

    var taskDetail;
    var sid = $.cookie('sid');
    var id = this.id;

    var a= getResp({"sid":$.cookie('sid'),"id": parseInt(id)},'task/get/');
    console.log(a);

});


function getResp(data, url) {
    var myVariable;
    $.ajax({
        type: "POST",
        crossDomain: true,
        'global': false,
        'async': false,
        dataType: "json",
        data: JSON.stringify(data),
        url: "http://95.46.98.99/sys/" + url,
        success: function (data) {
            myVariable = data;

        },
        error: function (xhr, ajaxOptions, thrownError) {
            //if end of session go to login
            // if(!((window.location.href).indexOf('login') != -1)){
            //     window.location.href = $(location).attr('href')+'login.html';
            // }
            myVariable = false;
        }
    });

    if(myVariable.result === true && myVariable){ //if valid session
        return myVariable;

    }else  {

        if(!((window.location.href).indexOf('login') != -1)){
            window.location.href = $(location).attr('href')+'login.html';
        }
        return false;
    }
}