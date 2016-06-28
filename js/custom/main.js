/*jslint unparam: true, browser: true, indent: 2 */
(function ($, window, document, undefined) {
    'use strict';

    var $doc = $(document),
        $window = $(window),
        startDate,
        endDate;
    var idForDelete;


    $doc.ready(function (jQuery) {

        $(".fancybox").fancybox();

        $('#current-date').html(moment().format("YYYY-MM-D"));
        $('#submit').click(function (e) {
            e.preventDefault();
            var login = $('input[name="login"]').val(),
                pass = $('input[name="pass"]').val();

            var sid = getResp({"login": login, "pass": pass}, 'auth/');
            if (sid.result === true) {
                // $.removeCookie('sid')
                $.cookie('sid', sid.sid);
                // console.log($(location));
                // console.log($(location).attr('href'));
                window.location.href = $(location).attr('href') + 'taskpage.html';
            }else{
                $.MessageBox(sid.msg);
            }
        });


        $('#reportrange').daterangepicker({
            format: 'YYYY/MM/DD',
            startDate: moment(),
            showDropdowns: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().add(-1, 'days'), moment().add(-1, 'days')],
                'Week': [moment().startOf('week'), moment().endOf('week')],
                'Month': [moment().startOf('month'), moment().endOf('month')]

            },
            opens: 'right',
            drops: 'down',
            buttonClasses: ['btn', 'btn-sm'],
            applyClass: 'button small',
            cancelClass: 'button alert small',
            separator: ' to ',
        }, function (start, end, label) {
            $('#reportrange span').html(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'));
            $("#daterange-input").val(start.format('YYYY/MM/D') + '-' + end.format('YYYY/MM/D'));
            startDate = start.format('YYYY/MM/D');
            endDate = end.format('YYYY/MM/D');
        });


        console.log($.cookie('sid'));
        if($('#wrapper').length>0) {
            //get list of tasks
            getTasks({"sid": $.cookie('sid')});
        }

        
        if ($('#wrapper').length > 0) {
            //get list of categories
            var array_category = getResp({"sid": $.cookie('sid')}, 'sys/offer/list/').list;

            if (array_category) {
                for (var i = 0; i < array_category.length; i++) {
                    $("#categories").append("<option value='" + array_category[i].name + "'>" + array_category[i].country + " " + array_category[i].name + "</option>");
                }

            }
        }


        //filter-tasks
        $('#filter-tasks').click(function (e) {
            e.preventDefault();

            var category = $('#categories').val(),
                data_cat = (category == 'all') ? '' : category;

            var data_set = {};
            data_set.sid = $.cookie('sid');
            if(data_cat != ''){
                data_set.oname = data_cat;
            }
            var date_val = $("#daterange-input").val();
            if(date_val.length>0){
                var date_arr = date_val.split('-');
                data_set.sdate = new Date(date_arr[0]+" 0:00:00" ).getTime();
                data_set.edate = new Date(date_arr[1]+" 23:59:59").getTime();
            }
            console.log(data_set);

            var a = getTasks(data_set);



        });

        //qiuck search
        $('#quick-search').click(function (e) {
            e.preventDefault();

            var list = $('#task_list ul li');
            list.removeClass('found');
            var searchString = $(this).parent().prev().find('input').val();
            console.log(searchString)
            list.each(function () {
                console.log($(this).text().indexOf(searchString))
                if ($(this).text().indexOf(searchString) == -1) {
                    $(this).addClass('hidden');
                } else {
                    $(this).removeClass('hidden');
                }
            });
        });

        $("#delete_task_id").click(function () {
            $.MessageBox({
                buttonDone  : "Yes",
                buttonFail  : "No",
                message     : "Do you want delete this task?"
            }).done(function(){
                var sid = $.cookie('sid');
                var id = parseInt(idForDelete);
                console.log(sid+" "+id);
                var deleted = getResp({"sid": sid, "id": id}, 'task/delete/');
                // // console.log(deleted);
                if (deleted.result === true){
                    $.MessageBox("Task was deleted!!!");
                    $("#task_list").find("#"+id).hide();
                } else {
                    $.MessageBox("Task was not deleted!!!");
                }
            }).fail(function(){

            });
        });
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

        } else {

            if (myVariable.result === false && (myVariable.msg).indexOf('invalid session') == -1) {
                return myVariable;
            } else if (!((window.location.href).indexOf('index') != -1)) {
                window.location.href = $(location).attr('href').slice(0, -13);
                return false;
            }


        }
    }


    function getTasks(data) {
        var tasks = getResp(data, 'task/list/');
        if (tasks) {
            var res = '';
            $.each(tasks.list, function (i) {
                // $.MessageBox( a.list[i].id );
                var date = new Date(tasks.list[i].ts);
                var month = (1 + date.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                var day = date.getDate().toString();
                day = day.length > 1 ? day : '0' + day;
                var sec = date.getSeconds().toString();
                sec = sec.length > 1 ? sec : '0' + sec;
                var newDate = date.getFullYear() + "-" + month + "-" + day + " " + date.getHours() + ":" + date.getMinutes() + ":" + sec;
                res += "<li class='task-list-class' id='" + tasks.list[i].id + "' ><span>" + tasks.list[i].id + "</span><span>" + newDate + "</span></li>";

            });
            $("#task_list ul").html(res);
            $(".task-list-class:first").click().addClass('active');
        }
    }


    $(document).on("click",".task-list-class",function() {
        $('.task-list-class').removeClass('active');

        var taskDetail;
        var sid = $.cookie('sid');
        var id = this.id;

        var a= getResp({"sid":$.cookie('sid'),"id": parseInt(id)},'task/get/');
        console.log(a);
        idForDelete = id;
        console.log(idForDelete);
        $('#show-product-info').removeClass('hidden');
        $('a#status').attr('data-status',a.state);
        $('#prod-info').html('<b>Date:</b>'+moment(a.ts).format()+'; '+'<b>Task:</b>'+a.id+'; '+'<b>Offer:</b>'+a.offerName+' '+a.country+'; '+'<b>Af id:</b>'+a.aid);
        $('#product-data-d').html(decodeURIComponent(escape(window.atob( a.data ))));
		$(".screenshot-list").html("");
		$.each(a.images, function (i) {
			$(".screenshot-list").append('<li><a class="fancybox" rel="group" href="data:image/png;base64,'+a.images[i].data+'"> <img  src="data:image/png;base64,'+a.images[i].data+'" alt=""/></a></li>');
		});

        $(this).addClass('active');

    });


}(jQuery, window, document));