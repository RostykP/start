/*jslint unparam: true, browser: true, indent: 2 */
(function($, window, document, undefined) {
    'use strict';

    var $doc = $(document),
        $window = $(window);


    $doc.ready(function(jQuery) {


        if(!($.cookie('sid'))){
            getRestData('POST', {"login" : "admin", "pass" : "admin"}, 'auth/');

        }

        
        $('input[name="daterange"]').daterangepicker({
            
        });


    });
    //GET JSON
    function getRestData(type, data, url) {

       $.ajax({
            type: type,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(data),
            url: "http://95.46.98.99/sys/"+url,
            success: function(result){
                if(url == 'auth/'){
                    if(!($.cookie('sid'))){
                        $.cookie('sid', result.sid);
                    }
                }


            },
            error: function (xhr, ajaxOptions, thrownError) {
                return(xhr.status);
            }
        });
    }

}(jQuery, window, document));