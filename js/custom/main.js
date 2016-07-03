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


        $("#task-page").click(function () {
            window.location.href = getStartLink() + 'taskpage.html';
        });
        $("#goods-page-from-user").click(function () {
            window.location.href = getStartLink() + 'goods.html';
        });
        $("#goods-page").click(function () {
            window.location.href = getStartLink() + 'goods.html';
        });
        var newUser = 0;
        $("#user-page").click(function () {
            window.location.href = getStartLink() + 'users.html';
        });


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
                        output = [list.slice(0, position), selected, list.slice(position)].join(''),
                        status = value.state == 1 ? 'checked' : '';

                    table += '<tr data-cat-id="' + value.id + '">' +
                        '<td>' + (key + 1) + '</td>' + // №
                        '<td><select disabled data-current = "' + value.id + '">' + output + '</select></td>' + // Category
                        '<td><input data-current="' + value.url + '" name="link" value="' + value.url + '" type="text" disabled> </td>' + // URL
                        '<td><input data-current="' + value.country + '" name="country" type="text" value="' + value.country + '" disabled></td>' + // Country
                        '<td class="js-code"><input type="text" onfocus="this.blur()" onkeydown="return false;"   value="JS code" disabled><textarea class="hidden">'+value.js+'</textarea></td>' + // JS code
                        '<td><input data-current="' + value.amount + '" type="number" min="1" name="amount" value="' + value.amount + '" disabled></td>' + // Amount
                        '<td class="status"><div class="switch"><input data-current="' + value.state + '" disabled class="switch-input" id="status-' + value.id + '" type="checkbox" ' + status + ' name="status"><label class="switch-paddle" for="status-' + value.id + '"></label></div></td>' + // Status
                        '<td><div class="columns small-6 text-center"><button type="button" class="button small edit">Edit</button></div><div class="columns small-6 text-center"><button type="button" class="button alert small delete">Delete</button></div>' +
                        '<div class="columns small-6 text-center"><button type="button" class="button small success  save hidden">Save</button></div><div class="columns small-6 text-center"><button type="button" class="button alert small cancel hidden">Cancel</button></div></td>' + // Actions
                        '</tr>';

                });

                goods_table.find('tbody').html(table);
                callSelect(goods_table);

                //trigger change
                $('#per-page').change();

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
                console.log(thrownError)
                myVariable = false;
            }

        });
        if (myVariable.result === true && myVariable) { //if valid session
            return myVariable;
        }
        else {
            if (myVariable.result === false && (myVariable.msg).indexOf('invalid session') == -1) {
                return myVariable;
            } else {
                window.location.href = getStartLink1();
                return false;
            }
        }
        // return myVariable;
        // if (myVariable.result === true && myVariable) { //if valid session
        //     return myVariable;
        // } else {
        //     if (myVariable.result === false && (myVariable.msg).indexOf('invalid session') == -1) {
        //         return myVariable;
        //     } else if (!((window.location.href).indexOf('index') != -1)) {
        //         window.location.href = $(location).attr('href').slice(0, -13);
        //         return false;
        //     }
        // }


    }

    function getStartLink1() {
        console.log($(location).attr('href'));
        var link = $(location).attr('href');
        var linkArr = link.split("//");
        var linkArr2 = linkArr[1].split("/");
        var length = linkArr2.length;
        var startLink = "http://";
        for (var i = 0; i < (length - 1); i++) {
            startLink = startLink + linkArr2[i] + "/";
        }
        console.log(startLink);
        return startLink;
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
            $(".screenshot-list").append('<li><a class="fancybox" rel="group" href="data:image/png;base64,' + a.images[i].data + '"> <img width="128" height="128" src="data:image/png;base64,' + a.images[i].data + '" alt=""/></a></li>');
        });

        $(this).addClass('active');

    });

    $window.on('resize', function () {

        $('#wrapper:not(.goods)').height(Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 40);
        $('#task_list ul').css('max-height', $('#wrapper').height() - $('.row.search').outerHeight() - $('.row.filter').outerHeight() + 'px');
        $('#product-data-d').height($('#wrapper').height() - $('.row.filter').outerHeight() - $('#show-product-info').outerHeight() - 40);
        // if($('#goods').length>0){
        //     $('#wrapper div.goods-table').height($('#wrapper').height() - $('.row.filter-goods').outerHeight() - $('div.goods-links').outerHeight());
        // }

    });


    //offers________________________________

    //call js code modal box
    $doc.on('click', '.js-code input:not(:disabled)', function (e) {
		var textarea = $(this).parent().find("textarea");
		var editor;
        popupS.confirm({
            mode: 'modal',
            title: 'Detail JS',
            content: '<div><textarea id="editor" name="js" width="400px">'+$(textarea).html()+'</textarea> </div>',
            className: 'additionalClass',  // for additional styling, gets append on every popup div
            placeholder: 'Input Text',     // only available for mode: 'prompt'
            flagCloseByEsc: false,
			flagCloseByOverlay: false, 
			labelOk:     'Yes',
			labelCancel: 'No',
			onOpen: function () {
				var myTextarea = document.getElementById("editor");
				editor = CodeMirror.fromTextArea(myTextarea, {
					lineNumbers: true,
					mode:  "javascript"	
				});
            },      // gets called when popup is opened
            onSubmit: function (val) {
				$(textarea).html(editor.getValue());
            }, // gets called when submitted. val as an paramater for prompts
            onClose: function () {
            }      // gets called when popup is closed
        });
    });

    //edit offers button
    $doc.on('click', '#goods .edit', function (e) {
        var _table = $(this).parents('tr');

        _table.find('input, select').prop('disabled', 'false').removeAttr("disabled");
        _table.find('button.edit,button.delete').addClass('hidden');
        _table.find('button.save,button.cancel').removeClass('hidden');
    });


    //cancel button
    $doc.on('click', '#goods .cancel', function (e) {
        var _table = $(this).parents('tr'),
            _td = _table.find('td');

        //set previous values
        $.each(_td, function (key, value) {
            var _this = $(this),
                _input = _this.find('input'),
                _select = _this.find('select');

            if (_input.length > 0 && _input.attr('data-current')) {
                if (_input.val() != _input.attr('data-current') && _input.attr('type') != "checkbox") {
                    _input.val(_input.attr('data-current'))
                } else if ((!(_input.is(':checked')) && _input.attr('data-current') == "1") || ((_input.is(':checked')) && _input.attr('data-current') == "0")) { // set default status of input switch
                    _input.click();
                }
            } else {
                if (_select.attr('data-id') != _select.attr('data-current')) {
                    _select.find('option[data-id=' + _select.attr('data-current') + ']').attr("selected", "selected");
                    var sel = _select.find('option[data-id=' + _select.attr('data-current') + ']').text();
                    _select.next().find('.select2-selection__rendered').html(sel)
                }
            }
        });

        // if (_table.hasClass('new')) {
        //     popupS.alert({
        //         content: 'Please, save your category before cancel'
        //     });
        // } else {
        //
        // }
        onSaveCancel(_table);
    });

    //delete button
    $doc.on('click', '#goods .delete', function (e) {
        var _table = $(this).parents('tr');

        popupS.confirm({
            content: 'Do you want to delete a current category?',
            onSubmit: function () {
                _table.remove();
                //remove category
                var del = getResp({
                    'sid': $.cookie('sid'),
                    'id': parseInt(_table.attr('data-cat-id'))
                }, 'offer/delete/');

            }
        });
    });

    //save button
    $doc.on('click', '#goods .save', function (e) {
        var _table = $(this).parents('tr'),
            _td = _table.find('td'),
            action = 1;


        var data = {};
        data.sid = $.cookie('sid');
        data.id = parseInt(_table.data('cat-id'));
        if (_table.find('input[name=country]').val() != '') {
            data.country = _table.find('input[name=country]').val();
            _table.find('input[name=country]').removeClass('error');
        } else _table.find('input[name=country]').addClass('error');

        data.name = encodeURIComponent(_table.find('select').val());

        //validate URL
        if (isUrlValid(_table.find('input[name=link]').val())) {
            data.url = (_table.find('input[name=link]').val());
            _table.find('input[name=link]').removeClass('error');
        } else _table.find('input[name=link]').addClass('error');

        data.js = "";
        data.js = _table.find('textarea').html();
        data.state = (_table.find('input.switch-input').is(':checked')) ? 1 : 0;

        if (_table.find('input[name=amount]').val() > 0) {
            data.amount = parseInt(_table.find('input[name=amount]').val());
            _table.find('input[name=amount]').removeClass('error');
        } else _table.find('input[name=amount]').addClass('error');


        //save data
        if (_table.find('.error').length == 0) {

            var url = 'offer/update/';
            if ($(this).hasClass('create-new')) {
                url = 'offer/create/';
                action = 0;
                delete data.id; //remove id if new one
            }
            console.log(data);

            var result = getResp(data, url);
            if (result.result === true && action == 1) { //if update successful
                popupS.alert({
                    content: 'Category was successfully updated!'
                });
                onSaveCancel(_table);
            } else if (result.result === true && action == 0) { //if create new
                popupS.alert({
                    content: 'Category created successfully!'
                });
                _table.removeClass('new'); //remove new Classname if there was a new category
                var current_id = MaxId(_table.parents('#goods')); //get the id of new category
                $.each(_td, function (key, value) {
                    //if input
                    var _input = $(this).find('input'),
                        _select = $(this).find('select');

                    if (_input.length > 0) {
                        if (_input.attr('type') != 'checkbox') {
                            _input.attr('data-current', _input.val());
                        } else {
                            var status = _input.is(':checked') ? 1 : 0;
                            _input.attr('data-current', status);
                        }
                    }
                });
                //update data-current tags
                _table.attr('data-cat-id', current_id);

                onSaveCancel(_table);
            } else if (result.result === false) {
                popupS.alert({
                    content: result.msg
                });

            }


        }

    });

    //add new category
    $doc.on('click', '#wrapper .add-good', function (e) {
        var table = $('#goods'),
            category_list = table.find('tr:first-child td:nth-child(2) select').html(),
            last_id = parseInt(table.find('tr:last-child td:first-child').text()) + 1,
            is_new = table.find('tr.new');

        //if there no any news <tr>
        if (is_new.length == 0) {
            $('#pagination ul li:last-child a').click();
            table.append('<tr class="new">' +
                '<td>' + last_id + '</td>' +
                '<td><select>' + category_list + '</select></td>' +
                '<td><input name="link" value="" type="text" ></td>' +
                '<td><input name="country" type="text" value="" ></td>' +
                '<td class="js-code"><input type="text" onfocus="this.blur()" onkeydown="return false;" value="JS code" ><textarea class="hidden"></textarea></td></td>' +
                '<td><input type="number" min="1" name="amount" value="1" ></td>' +
                '<td class="status"><div class="switch"><input class="switch-input" id="status-' + last_id + '" type="checkbox" checked="" name="status"><label class="switch-paddle" for="status-' + last_id + '"></label></div></td>' +
                '<td><div class="columns small-6 text-center"><button type="button" class="button small edit hidden">Edit</button></div><div class="columns small-6 text-center"><button type="button" class="button alert small delete hidden">Delete</button></div><div class="columns small-6 text-center"><button type="button" class="button small success save create-new">Save</button></div><div class="columns small-6 text-center"><button type="button" class="button alert small cancel">Cancel</button></div></td>' +
                '</tr>');

            callSelect(table); //reinitialize select2
        } else {
            is_new.find('input[name=link]').focus();
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


    //check if were changes in table
    $doc.on('keypress change', '#goods input, #goods select', function (e) {
        $(this).parents('tr').addClass('were-edit');
    });


    //select count on page
    $doc.on('change', '#per-page', function (e) {
        var _table = $('#goods'),
            _tr = _table.find('tbody tr'),
            pagination = $('#pagination ul'),
            count = _tr.length,
            show_on_page = $(this).val(),
            pages = Math.ceil(count / show_on_page),
            list = '';

        _tr.show();
        _table.find('tbody tr:gt(' + (show_on_page - 1) + ')').hide();

        for (var i = 1; i <= pages; i++) {
            if(i == 1){
                list += '<li class="current"><a href="#">'+i+'</a></li>';
            }else  list += '<li><a href="#">'+i+'</a></li>';
        }
        pagination.attr('per-page',show_on_page);

        if(pages > 1){
            pagination.html(list);

        }else  pagination.html('');


    });

    $doc.on('click','#pagination li a',function (e) {
       e.preventDefault();

        var _table = $('#goods'),
            _tr = _table.find('tbody tr'),
            show_on_page = parseInt($(this).parents('ul').attr('per-page')),
            current = parseInt($(this).text()),
            gt=0,
            lt = 0;

        $(this).parents('ul').find('.current').removeClass('current');
        $(this).parent().addClass('current');

        if(current == 1){
            lt =  show_on_page;
        }else{
            gt = (current-1)*show_on_page;
            lt = current*show_on_page;
        }
        _tr.hide();
        _table.find('tbody tr').slice(gt,lt).show();


    });

    function isUrlValid(url) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
    }

    if (!window.btoa) {
        window.btoa = function (str) {
            return Base64.encode(str);
        }
    }

    if (!window.atob) {
        window.atob = function (str) {
            return Base64.decode(str);
        }
    }

    function callSelect(el) {
        el.find('select').select2({
            tags: true
        });

    }

    //show/hide buttons and remove edit class of <tr>
    function onSaveCancel(el) {
        el.removeClass('were-edit');
        el.find('input, select').prop('disabled', 'true').attr("disabled");
        el.find('button.save,button.cancel').addClass('hidden');
        el.find('button.edit,button.delete').removeClass('hidden');
    }

    //get the highest id of category
    function MaxId(selector) {
        var max = null,
            _tr = selector.find('tbody tr');

        $.each(_tr, function (key, value) {
            var id = parseInt($(this).attr('data-cat-id'));
            if ((max === null) || (id > max)) {
                max = id;
            }
        });
        return {max: max};
    }


    //get task
    function getStartLink() {
        console.log($(location).attr('href'));
        var link = $(location).attr('href');
        var linkArr = link.split("//");
        var linkArr2 = linkArr[1].split("/");
        var length = linkArr2.length;
        var startLink = "http://";
        for (var i = 0; i < (length - 1); i++) {
            startLink = startLink + linkArr2[i] + "/";
        }
        console.log(startLink);
        return startLink;
    }

    //check if there are no changes not saving
    $(window).on('beforeunload', function (e) {
        var table = $('#goods');

        if (table.find('tr.were-edit').length > 0 || table.find('tr.new').length > 0) {

            return 'Do you really want to close window tab?';
        }

    });

}(jQuery, window, document));