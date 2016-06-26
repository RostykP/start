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
                window.location.href = $(location).attr('href').slice(0, -10) + 'index.html';
            }else{
                alert(sid.msg);
            }



        });
        $('input[name="daterange"]').daterangepicker({});





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