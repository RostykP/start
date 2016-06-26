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

        // var a= getResp({"sid":$.cookie('sid')},'task/list/');
        // console.log(a);


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
                'Тиждень': [moment().startOf('week'), moment().endOf('week')],
                'Місяць': [moment().startOf('month'), moment().endOf('month')],
                'Рік': [moment().startOf('year'), moment().endOf('year')]
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
                daysOfWeek: ['Нд', 'По', 'Вт', 'Ср', 'Чт', 'Пт','Сб'],
                monthNames: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
                firstDay: 1
            }
        }, function(start, end, label) {
            $('#reportrange span').html(start.format('D.MM.YYYY') + ' - ' + end.format('D.MM.YYYY'));
            $("#daterange-input").val(start.format('D.MM.YYYY') + ' - ' + end.format('D.MM.YYYY'));
        });



        console.log( $.cookie('sid'));




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


    });


}(jQuery, window, document));