/**
 * Created by Slavic_Gutnyk on 6/27/2016.
 */
$(document).ready(function () {

    $("#user-page").click(function () {
        window.location.href = $(location).attr('href').slice(0, -13)+ 'users.html';
    });
    
    
});

//get task


// function getResp(data, url) {
//     var myVariable;
//     $.ajax({
//         type: "POST",
//         crossDomain: true,
//         'global': false,
//         'async': false,
//         dataType: "json",
//         data: JSON.stringify(data),
//         url: "http://95.46.98.99/sys/" + url,
//         success: function (data) {
//             myVariable = data;
//
//         },
//         error: function (xhr, ajaxOptions, thrownError) {
//             //if end of session go to login
//             // if(!((window.location.href).indexOf('login') != -1)){
//             //     window.location.href = $(location).attr('href')+'login.html';
//             // }
//             myVariable = false;
//         }
//     });
//
//     if(myVariable.result === true && myVariable){ //if valid session
//         return myVariable;
//
//     }else  {
//         if (myVariable.result === false && (myVariable.msg).indexOf('invalid session') == -1) {
//             return myVariable;
//         } else if (!((window.location.href).indexOf('login') != -1)) {
//             window.location.href = $(location).attr('href') + 'login.html';
//             return false;
//         }
//
//
//     }
// }