/**
 * Created by Slavic_Gutnyk on 6/27/2016.
 */
$(document).ready(function () {

    // $("#test").click(function () {
    //     console.log($(location).attr('href'));
    //     var link = $(location).attr('href');
    //     var linkArr = link.split("//");
    //     var linkArr2 = linkArr[1].split("/");
    //     var length = linkArr2.length;
    //     var newLink = "http://";
    //     for(i=0; i<(length-1); i++){
    //         newLink = newLink + linkArr2[i]+"/";
    //     }
    //     console.log(newLink);
    //
    // });
    var newUser = 0;
     var sid = $.cookie('sid');
     var users = getResp1({"sid": sid}, "user/list/");
    console.log(users);
    if (users) {
        var count = 1;
        $.each(users.list, function (i) {
            if(users.list[i].state == 1){
                var state = 1;
                $("#all-user-table").append("<tr id='"+users.list[i].id+"'><td>"+count+"</td><td class='table-row'><input class ='login-row' id='"+users.list[i].login+"_deflog' type='text' value='"+users.list[i].login+"'></td>"+
                    "<td class='table-row'><input class='pass-row' placeholder='Enter password' type='password' value='11111111'></td><td class='table-row'>"+
                    "<input id='"+state+"_defstate' class = 'switch' type='checkbox' checked></td>"+
                    "<td><div class='edit-buttons  '><input class='button small' id='edit-user' type='button' value='Edit'><input class='button small alert' id='delete-user' type='button' value='Delete'></div>"+
                    "<div hidden class='save-buttons'><input id='save-user' class='button small' type='button' value='Save'><input class='button small alert' id='cancel-save-user' type='button' value='Cancel'></div></td></tr>");

            } else {
                var state = 0;
                $("#all-user-table").append("<tr id='"+users.list[i].id+"'><td>"+count+"</td><td class='table-row'><input class ='login-row' id='"+users.list[i].login+"_deflog' type='text' value='"+users.list[i].login+"'></td>"+
                    "<td class='table-row'><input class='pass-row' placeholder='Enter password' type='password' value='11111111'></td><td class='table-row'>"+
                    "<input id='"+state+"_defstate' class = 'switch' type='checkbox'></td>"+
                    "<td><div class='edit-buttons'><input id='edit-user' class='button small' type='button' value='Edit'><input class='button small alert' id='delete-user' type='button' value='Delete'></div>"+
                    "<div hidden class='save-buttons'><input id='save-user' class='button small' type='button' value='Save'><input class='button small alert' id='cancel-save-user' type='button' value='Cancel'></div></td></tr>");

            }
            count++;
            $(".table-row input").attr('disabled', true);
            $('.switch').lc_switch();
        });
    }
    $("#add-user").click(function(){
        if (newUser == 0) {
            var lastCount = parseInt($("#all-user-table tr:last td:first").html());
            lastCount++;
            newUser = 1;
            // alert(lastCount);
            $("#all-user-table").append("<tr id='new-user-id'><td>" + lastCount + "</td><td class='table-row'><input class ='login-row'  type='text' value=''></td>" +
                "<td class='table-row'><input class='pass-row' placeholder='Enter password' type='password' value=''></td><td class='table-row'>" +
                "<input  class = 'switch' type='checkbox' checked></td>" +
                "<td><div hidden class='edit-buttons'><input id='edit-user' class='button small' type='button' value='Edit'><input class='button small alert' id='delete-user' type='button' value='Delete'></div>" +
                "<div  class='save-buttons'><input id='save-user' class='button small' type='button' value='Save'><input class='button small alert' id='cancel-save-user' type='button' value='Cancel'></div></td></tr>");
            $('.switch').lc_switch();
        } else {
            $.MessageBox("Please finish last adding user!!!");
        }
    });


    $(document).on("click","#edit-user",function() {
    // $("#edit-user").click(function(){
        if (newUser == 0) {
        var id = parseInt($(this).parent().parent().parent().attr('id'));
        $("#"+id+" .table-row input").attr('disabled', false);
        $("#"+id+" .table-row .lcs_wrap div").removeClass('lcs_disabled');
        $("#"+id+" .table-row .pass-row").val('');
        $("#"+id+" .table-row .pass-row").attr('type','text');
        $("#"+id+" .edit-buttons").hide();
        $("#"+id+" .save-buttons").show();
        } else {
            $.MessageBox("Please finish last adding user!!!");
        }
    });

    $(document).on("click","#delete-user",function() {
    // $("#delete-user").click(function(){
        if (newUser == 0) {
        var id = parseInt($(this).parent().parent().parent().attr('id'));
        $.MessageBox({
            buttonDone  : "Delete",
            buttonFail  : "Cancel",
            message     : "Are you sure you want to delete this user?"
        }).done(function(){
            var sid = $.cookie('sid');
            console.log(sid+" "+id);
            var deleteUser = getResp1({"sid": sid, "id": id}, 'user/delete/');
            // // console.log(deleted);
            if (deleteUser.result === true){
                $.MessageBox("User was deleted!!!");
                $("#all-user-table").find("#"+id).hide();
            } else {
                $.MessageBox("User was not deleted!!!\n"+deleteUser.result.msg);
            }
        }).fail(function(){
        });
        } else {
            $.MessageBox("Please finish last adding user!!!");
        }
    });


    $(document).on("click","#save-user",function() {
    // $("#save-user").click(function(){
        if (newUser == 0){
        var id = parseInt($(this).parent().parent().parent().attr('id'));
        var newLogin = $("#"+id+" .table-row .login-row").val();
        var newPassword = $("#"+id+" .table-row .pass-row").val();
        var newStatus;
        if($("#"+id+" .table-row .lcs_wrap div").hasClass("lcs_on")){
            newStatus = 1;
        } else {
            newStatus = 0;
        }

        $.MessageBox({
            buttonDone  : "Ok",
            buttonFail  : "Cancel",
            message     : "Are you sure you want to save this user?"
        }).done(function(){
            var sid = $.cookie('sid');
            console.log(newLogin+" "+newPassword+" "+newStatus);
            var updateUser = getResp1({"sid": sid, "id": id, "login":newLogin, "pass":newPassword}, 'user/update/');
            if (updateUser.result === true){
                $.MessageBox("User was saved!!!");
                $("#"+id+" .table-row input").attr('disabled', true);
                $("#"+id+" .table-row .lcs_wrap div").addClass('lcs_disabled');
                $("#"+id+" .edit-buttons").show();
                $("#"+id+" .save-buttons").hide();
                $("#"+id+" .table-row .pass-row").attr('type','password');
                $("#"+id+" .table-row .pass-row").val('11111111');
                $("#"+id+" .table-row .login-row").attr('id',newLogin+"_deflog");
                $("#"+id+" .table-row .switch").attr('id',newStatus+'_defstate');
            } else {
                $.MessageBox("User was not saved!!!\n"+updateUser.result.msg);
            }
        }).fail(function(){
        });
    } else {
            var id = $(this).parent().parent().parent().attr('id');
            var newLogin = $("#"+id+" .table-row .login-row").val();
            var newPassword = $("#"+id+" .table-row .pass-row").val();
            var newStatus;
            if($("#"+id+" .table-row .lcs_wrap div").hasClass("lcs_on")){
                newStatus = 1;
            } else {
                newStatus = 0;
            }

            $.MessageBox({
                buttonDone  : "Ok",
                buttonFail  : "Cancel",
                message     : "Are you sure you want to create this user?"
            }).done(function() {
                if (newLogin != "" && newPassword != "") {
                var sid = $.cookie('sid');
                console.log(newLogin + " " + newPassword + " " + newStatus);
                var createUser = getResp1({"sid": sid, "login": newLogin, "pass": newPassword}, 'user/create/');
                if (createUser.result === true) {
                    $.MessageBox("User was created!!!");
                    $("#" + id + " .table-row input").attr('disabled', true);
                    $("#" + id + " .table-row .lcs_wrap div").addClass('lcs_disabled');
                    $("#" + id + " .edit-buttons").show();
                    $("#" + id + " .save-buttons").hide();
                    $("#" + id + " .table-row .pass-row").attr('type', 'password');
                    $("#" + id + " .table-row .pass-row").val('11111111');
                    $("#" + id + " .table-row .login-row").attr('id', newLogin + "_deflog");
                    $("#" + id + " .table-row .switch").attr('id', newStatus + '_defstate');
                    $("#" + id).attr('id', createUser.id);
                    newUser = 0;
                } else {
                    $.MessageBox("User was not saved!!!\n" + createUser.result.msg);
                }
            } else {
                    $.MessageBox("Please enter login and password!!!");
                }
            }).fail(function(){
            });
    }
    });
    $(document).on("click","#cancel-save-user",function() {
    // $("#cancel-save-user").click(function(){
    //     console.log(newUser);
    //     var ids= $(this).parent().parent().parent().attr('id');
    //     console.log(ids);
         if (newUser == 0) {
            var id = parseInt($(this).parent().parent().parent().attr('id'));
            var oldLogin = $("#" + id + " .table-row .login-row").attr('id');
            // var oldPassword = $("#"+id+" .table-row .pass-row").attr('id');
            var oldStatus = $("#" + id + " .table-row .switch").attr('id');
            var oldLoginTemp = oldLogin.split("_");
            // var oldPasswordTemp = oldPassword.split("_");
            var oldStatusTemp = oldStatus.split("_");
            $("#" + id + " .table-row .login-row").val(oldLoginTemp[0]);
            $("#" + id + " .table-row .pass-row").val("");
            if (oldStatusTemp[0] == 0) {
                $("#" + id + " .table-row .lcs_wrap div").removeClass("lcs_on");
                $("#" + id + " .table-row .lcs_wrap div").addClass("lcs_off");
            } else {
                $("#" + id + " .table-row .lcs_wrap div").removeClass("lcs_off");
                $("#" + id + " .table-row .lcs_wrap div").addClass("lcs_on");
            }
            $("#" + id + " .table-row input").attr('disabled', true);
            $("#" + id + " .table-row .lcs_wrap div").addClass('lcs_disabled');
            $("#" + id + " .edit-buttons").show();
            $("#" + id + " .save-buttons").hide();
            $("#" + id + " .table-row .pass-row").attr('type', 'password');
            $("#" + id + " .table-row .pass-row").val('11111111');
        } else {
            var id =$(this).parent().parent().parent().attr('id');
            console.log(id);
            $("#"+id).remove();
            newUser = 0;
        }
    });

});



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
    else {
        if (myVariable.result === false && (myVariable.msg).indexOf('invalid session') == -1) {
            return myVariable;
        } else  {
            $.removeCookie('sid');
            window.location.href = getStartLink();
            return false;
        }
    }


}