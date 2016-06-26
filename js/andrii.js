/**
 * Created by Andrii PC on 26.06.2016.
 */

(function ($, window, document, undefined) {
    'use strict';

    var $doc = $(document),
        $window = $(window);

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
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
        return myVariable;
    }

    $(document).on("click",".task-list-class",function() {
        var taskDetail;
        var sid = $.cookie('sid');
        var id = this.id;
        var a= getResp({"sid":$.cookie('sid'),"id":1},'task/get/');
        console.log(a);

    });
    $doc.ready(function (jQuery) {

            var a= getResp({"sid":$.cookie('sid')},'task/list/');
            console.log(a);
        $.each( a.list, function( i ) {
            // alert( a.list[i].id );
            var date = new Date(a.list[i].ts);
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            var sec = date.getSeconds().toString();
            sec = sec.length > 1 ? sec : '0' + sec;
            var newDate = date.getFullYear()+"-"+month+"-"+day+" "+date.getHours()+":"+date.getMinutes()+":"+sec;
            $("#task_list").append("<div class='task-list-class' id='"+a.list[i].id+"' ><div>"+a.list[i].id+"</div><div>"+newDate+"</div></div>");
        });


        var array_category = getResp({"sid":$.cookie('sid')}, 'sys/offer/list/').list;
        for(var i=0; i<array_category.length; i++){
            $("#categories").append("<option value='"+array_category[i].id+"'>"+array_category[i].country+" "+array_category[i].name+"</option>");
        }


    });


}(jQuery, window, document));