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
            } else {
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
        if ($('#wrapper').length > 0) {
            //get list of tasks
            getTasks({"sid": $.cookie('sid')});
        }


        if ($('#wrapper').length > 0) {
            //get list of categories
            var array_category = getResp({"sid": $.cookie('sid')}, 'sys/offer/list/').list;
            var list = '';

            if (array_category) {
                for (var i = 0; i < array_category.length; i++) {

                    list += '<option data-id="' + array_category[i].id + '" value="' + array_category[i].name + '">' + array_category[i].country + ' ' + array_category[i].name + '</option>';
                }
                $("#categories").html(list);

            }
            //OFFERS
            var goods_table = $('#goods');
            if (goods_table.length > 0) {
                var table = '',
                    selected = "selected ";

                $.each(array_category, function (key, value) {
                    var position = list.indexOf('data-id="' + value.id + '"'),
                        output = [list.slice(0, position), selected, list.slice(position)].join('');

                    table += '<tr data-cat-id="' + value.id + '">' +
                        '<td>' + (key + 1) + '</td>' + // №
                        '<td><select disabled>' + output + '</select></td>' + // Category
                        '<td><input name="link" value="' + value.url + '" type="text" disabled> </td>' + // URL
                        '<td><input name="country" type="text" value="' + value.country + '" disabled></td>' + // Country
                        '<td class="js-code"><input type="text" onfocus="this.blur()" onkeydown="return false;"   value="JS code" disabled></td>' + // JS code
                        '<td><input type="number" min="1" name="amount" value="' + value.amount + '" disabled></td>' + // Amount
                        '<td class="status"><div class="switch"><input disabled class="switch-input" id="status-' + value.id + '" type="checkbox" checked="" name="status"><label class="switch-paddle" for="status-' + value.id + '"></label></div></td>' + // Status
                        '<td><div class="columns small-6 text-center"><button type="button" class="button small edit">Edit</button></div><div class="columns small-6 text-center"><button type="button" class="button alert small delete">Delete</button></div>' +
                        '<div class="columns small-6 text-center"><button type="button" class="button small success  save hidden">Save</button></div><div class="columns small-6 text-center"><button type="button" class="button alert small cancel hidden">Cancel</button></div></td>' + // Actions
                        '</tr>';

                });

                goods_table.find('tbody').html(table);
                goods_table.find('select').select2({
                    "language": {
                        "noResults": function () {
                            return "There are no category. Will be crate new one with current nume";
                        }
                    },
                    escapeMarkup: function (markup) {
                        return markup;
                    }
                });
            }

        }


        //filter-tasks
        $('#filter-tasks').click(function (e) {
            e.preventDefault();

            var category = $('#categories').val(),
                data_cat = (category == 'all') ? '' : category;

            var data_set = {};
            data_set.sid = $.cookie('sid');
            if (data_cat != '') {
                data_set.oname = data_cat;
            }
            var date_val = $("#daterange-input").val();
            if (date_val.length > 0) {
                var date_arr = date_val.split('-');
                data_set.sdate = new Date(date_arr[0] + " 0:00:00").getTime() / 1000.0;
                data_set.edate = new Date(date_arr[1] + " 23:59:59").getTime() / 1000.0;
            }
            console.log(data_set);

            var a = getTasks(data_set);


        });

        //qiuck search
        $('#quick-search').click(function (e) {
            getTasks({"sid": $.cookie('sid')});
            e.preventDefault();

            var list = $('#task_list ul li');
            list.removeClass('found');
            var searchString = $(this).parent().prev().find('input').val();

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
                buttonDone: "Yes",
                buttonFail: "No",
                message: "Do you want delete this task?"
            }).done(function () {
                var sid = $.cookie('sid');
                var id = parseInt(idForDelete);
                console.log(sid + " " + id);
                var deleted = getResp({"sid": sid, "id": id}, 'task/delete/');
                // // console.log(deleted);
                if (deleted.result === true) {
                    $.MessageBox("Task was deleted!!!");
                    $("#task_list").find("#" + id).hide();
                } else {
                    $.MessageBox("Task was not deleted!!!");
                }
            }).fail(function () {

            });
        });


        $window.trigger('resize');


    });

//function getIP(){
//    var IP="";
    //   $.ajax({
    //      url: "IP.txt",
    //      dataType: "text",
    //     async: true,
    //    success: function(msg){
    //        alert(msg)
//            IP = msg.split('\n')[0].replace(/\n+$/m , '');
    //       }
    //   });
    //   alert(IP)
    //   return IP;
//}
    function getResp(data, url) {
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
            url: "http://" + $.cookie('domain') + "/sys/" + url,
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
                var date = new Date(tasks.list[i].ts * 1000);
                var month = (1 + date.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                var day = date.getDate().toString();
                day = day.length > 1 ? day : '0' + day;
                var sec = date.getSeconds().toString();
                sec = sec.length > 1 ? sec : '0' + sec;
                var newDate = date.getFullYear() + "-" + month + "-" + day + "<br> " + date.getHours() + ":" + date.getMinutes() + ":" + sec;
                res += "<li class='task-list-class' id='" + tasks.list[i].id + "' ><span>" + tasks.list[i].id + " -</span><span>" + newDate + "</span></li>";

            });
            $("#task_list ul").html(res);
            $(".task-list-class:first").click().addClass('active');
        }
    }


    $(document).on("click", ".task-list-class", function () {
        $('.task-list-class').removeClass('active');

        var taskDetail;
        var sid = $.cookie('sid');
        var id = this.id;

        var a = getResp({"sid": $.cookie('sid'), "id": parseInt(id)}, 'task/get/');
        console.log(a);
        idForDelete = id;
        console.log(idForDelete);
        $('#show-product-info').removeClass('hidden');
        $('a#status').attr('data-status', a.state);
        $('#prod-info').html('<b>Date:</b>' + moment(a.ts * 1000).format() + '; ' + '<b>Task: #</b>' + a.id + '; ' + '<b>Offer:</b> -' + a.country + ' - ' + a.offerName + '; ' + '<b>Af id:</b>' + a.aid);
        $('#product-data-d').html(decodeURIComponent(escape(window.atob(a.data))));
        $(".screenshot-list").html("");
        $.each(a.images, function (i) {
            $(".screenshot-list").append('<li><a class="fancybox" rel="group" href="data:image/png;base64,' + a.images[i].data + '"> <img  src="data:image/png;base64,' + a.images[i].data + '" alt=""/></a></li>');
        });

        $(this).addClass('active');

    });

    $window.on('resize', function () {

        $('#wrapper').height(Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 40);
        $('#task_list ul').css('max-height', $('#wrapper').height() - $('.row.search').outerHeight() - $('.row.filter').outerHeight() + 'px');
        $('#product-data-d').height($('#wrapper').height() - $('.row.filter').outerHeight() - $('#show-product-info').outerHeight() - 40);

    });


    //offers________________________________

    //call js code modal box
    $doc.on('click', '.js-code input:not(:disabled)', function (e) {
        popupS.window({
            mode: 'alert',
            content: 'Hey'
        });
    });

    //edit offers button
    $doc.on('click', '#goods .edit', function (e) {
        var _table = $(this).parents('tr');

        _table.find('input, select').prop('disabled', 'false').removeAttr("disabled")
        _table.find('button.edit,button.delete').addClass('hidden');
        _table.find('button.save,button.cancel').removeClass('hidden');
    });


    //cancel button
    $doc.on('click', '#goods .cancel', function (e) {
        var _table = $(this).parents('tr');

        _table.find('input, select').prop('disabled', 'true').attr("disabled");
        _table.find('button.save,button.cancel').addClass('hidden');
        _table.find('button.edit,button.delete').removeClass('hidden');
    });

    //delete button
    $doc.on('click', '#goods .delete', function (e) {
        var _table = $(this).parents('tr');

        popupS.confirm({
            content: 'Do you want to delete a current category?',
            onSubmit: function () {
                _table.remove();
                //remove categort getResp();
            }
        });
    });

    //save button
    $doc.on('click', '#goods .save', function (e) {
        var _table = $(this).parents('tr');


        var data = {};
        data.sid = $.cookie('sid');
        data.id = parseInt(_table.data('cat-id'));
        data.country = _table.find('input[name=country]').val();
        data.name = btoa(_table.find('select').val());

        //validate URL
        if (isUrlValid(_table.find('input[name=link]').val())) {
            data.url = btoa(_table.find('input[name=link]').val());
            _table.find('input[name=link]').removeClass('error');
        } else _table.find('input[name=link]').addClass('error');


        // data.js = _table.find('input[name=link]').val();
        data.state = (_table.find('input.switch-input').is(':checked')) ? 1 : 0;

        if (_table.find('input[name=amount]').val() > 0) {
            data.amount = parseInt(_table.find('input[name=amount]').val());
            _table.find('input[name=amount]').removeClass('error');
        } else _table.find('input[name=amount]').addClass('error');

        //save data
        if (_table.find('.error').length == 0) {
            var result = getResp({'sid':$.cookie('sid')},'offer/update/');
            console.log(result);
        }

    });

    $doc.on('keydown', '#goods input[name=amount]', function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });


    function isUrlValid(url) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
    }

    if (!window.btoa) {
        window.btoa = function(str) {
            return Base64.encode(str);
        }
    }

    if (!window.atob) {
        window.atob = function(str) {
            return Base64.decode(str);
        }
    }

}(jQuery, window, document));