/*jslint unparam: true, browser: true, indent: 2 */
(function ($, window, document, undefined) {
    'use strict';

    var $doc = $(document),
        $window = $(window);


    $doc.ready(function (jQuery) {

        $('#submit').click(function (e) {
            e.preventDefault();
            var login = $('input[name="login"]').val(),
                pass = $('input[name="pass"]').val();

            var sid = getResp({"login": login, "pass": pass}, 'auth/');
            if(sid.result){
                // $.removeCookie('sid')
                $.cookie('sid', sid.sid);

                window.location.href = $(location).attr('href').slice(0, -10);
            }else{
                alert(sid.msg);
            }
        });


        $('#reportrange').daterangepicker({
            format: 'D/MM/YYYY',
            startDate: moment().today,
            minDate: '01/01/2012',
            maxDate: '12/31/2015',
            showDropdowns: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                'Сьогодні': [moment(), moment()],
				'Вчора': [moment().add(-1, 'days'), moment().add(-1, 'days')],
                'Тиждень': [moment().startOf('week'), moment().endOf('week')],
                'Місяць': [moment().startOf('month'), moment().endOf('month')]
                
            },
            opens: 'right',
            drops: 'down',
            buttonClasses: ['btn', 'btn-sm'],
            applyClass: 'btn-primary',
            cancelClass: 'btn-default',
            separator: ' to ',
            locale: {
                applyLabel: 'Так',
                cancelLabel: 'Скинути',
                fromLabel: 'Від',
                toLabel: 'До',
                customRangeLabel: 'Період',
                daysOfWeek: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт','Сб'],
                monthNames: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
                firstDay: 1
            }
        }, function(start, end, label) {
            $('#reportrange span').html(start.format('D.MM.YYYY') + ' - ' + end.format('D.MM.YYYY'));
            $("#daterange-input").val(start.format('D.MM.YYYY') + ' - ' + end.format('D.MM.YYYY'));
        });



        console.log( $.cookie('sid'));


      


        //get list of categories
        var array_category = getResp({"sid":$.cookie('sid')}, 'sys/offer/list/').list;

        if(array_category){
            for(var i=0; i<array_category.length; i++){
                $("#categories").append("<option value='"+array_category[i].id+"'>"+array_category[i].country+" "+array_category[i].name+"</option>");
            }

        }


        //filter-tasks
        $('#filter-tasks').click(function () {

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

}(jQuery, window, document));