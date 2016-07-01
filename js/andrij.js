/**
 * Created by Slavic_Gutnyk on 6/27/2016.
 */
$(document).ready(function () {

    $("#user-page").click(function () {
        window.location.href = $(location).attr('href').slice(0, -13)+ 'users.html';
    });

     var sid = $.cookie('sid');
     var users = getResp1({"sid": sid}, "user/list/");
    console.log(users);
    if (users) {
        var count = 1;
        $.each(users.list, function (i) {
            if(users.list[i].state == 1){
                var state = 1;
                $("#all-user-table").append("<tr id='"+users.list[i].id+"'><td>"+count+"</td><td class='table-row'><input id='"+users.list[i].login+"_deflog' type='text' value='"+users.list[i].login+"'></td>"+
                    "<td class='table-row'><input class='pass-row' placeholder='Enter password' type='password' value=''></td><td class='table-row'>"+
                    "<input id='"+state+"_defstate' class = 'switch' type='checkbox' checked></td>"+
                    "<td><div class='edit-buttons'><input id='edit-user' type='button' value='Edit'><input id='delete-user' type='button' value='Delete'></div>"+
                    "<div hidden class='save-buttons'><input id='save-user' type='button' value='Save'><input id='cancel-save-user' type='button' value='Cancel'></div></td></tr>");

            } else {
                var state = 0;
                $("#all-user-table").append("<tr id='"+users.list[i].id+"'><td>"+count+"</td><td class='table-row'><input id='"+users.list[i].login+"_deflog' type='text' value='"+users.list[i].login+"'></td>"+
                    "<td class='table-row'><input class='pass-row' placeholder='Enter password' type='password' value=''></td><td class='table-row'>"+
                    "<input id='"+state+"_defstate' class = 'switch' type='checkbox'></td>"+
                    "<td><div class='edit-buttons'><input id='edit-user' type='button' value='Edit'><input id='delete-user' type='button' value='Delete'></div>"+
                    "<div hidden class='save-buttons'><input id='save-user' type='button' value='Save'><input id='cancel-save-user' type='button' value='Cancel'></div></td></tr>");

            }
            count++;
            $(".table-row input").attr('disabled', true);
            $('.switch').lc_switch();
        });
    }
    $("#add-user").click(function(){

    });
    $("#edit-user").click(function(){
        var id = parseInt($(this).parent().parent().parent().attr('id'));
        $("#"+id+" .table-row input").attr('disabled', false);
        $("#"+id+" .table-row .lcs_wrap div").removeClass('lcs_disabled');
        $("#"+id+" .table-row .pass-row").attr('type','text');
        $("#"+id+" .edit-buttons").hide();
        $("#"+id+" .save-buttons").show();
    });
    $("#delete-user").click(function(){
        var id = parseInt($(this).parent().parent().attr('id'));
        $.MessageBox({
            buttonDone  : "Delete",
            buttonFail  : "Cancel",
            message     : "Are you sure you want to delete this user?"
        }).done(function(){
            var sid = $.cookie('sid');
            console.log(sid+" "+id);
            var deleteUser = getResp({"sid": sid, "id": id}, 'user/delete/');
            // // console.log(deleted);
            if (deleteUser.result === true){
                $.MessageBox("Task was deleted!!!");
                $("#all-user-table").find("#"+id).hide();
            } else {
                $.MessageBox("Task was not deleted!!!\n"+deleteUser.result.msg);
            }
        }).fail(function(){
        });
    });
    $("#save-user").click(function(){

    });
    $("#cancel-save-user").click(function(){

    });

});

//get task


function getResp1(data, url) {
    var myVariable;
    //  var IP=getIP();
    //$.get('IP.txt', function(dataIP){
    //IP = dataIP.split('\n')[0].replace(/\n+$/m , '');
    //IP = "http://"+IP+"/sys/" + url;
    // });
    //alert("http://"+IP+"/sys/" + url)
    $.ajax({
        type: "POST",
        crossDomain: true,
        'global': false,
        'async': false,
        dataType: "json",
        data: JSON.stringify(data),
        url: "http://"+$.cookie('domain')+"/sys/" + url,
        success: function (data) {
            myVariable = data;

            console.log(myVariable)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //if end of session go to login
            // if(!((window.location.href).indexOf('login') != -1)){
            //     window.location.href = $(location).attr('href')+'login.html';
            // }

            myVariable = false;
        }

    });

    if (myVariable.result === true && myVariable) { //if valid session
        return myVariable;
    }
    // else {
    //     if (myVariable.result === false && (myVariable.msg).indexOf('invalid session') == -1) {
    //         return myVariable;
    //     } else if (!((window.location.href).indexOf('index') != -1)) {
    //         window.location.href = $(location).attr('href').slice(0, -13);
    //         return false;
    //     }
    // }


}