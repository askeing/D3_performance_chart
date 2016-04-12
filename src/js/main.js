/**
 * Created by Askeing on 16/4/11.
 */

function getParameter(parameter_name)
{
    var selfURL = window.location.search.substring(1);
    var parameters = selfURL.split('&');
    for (var i = 0; i < parameters.length; i++)
    {
        var parameter = parameters[i].split('=');
        if (parameter[0] == parameter_name)
        {
            return parameter[1];
        }
    }
}

$(document).ready(function() {

    var performance_json = new Object();

    var p = getParameter("p");
    if (p) {
        performance_json = JSON.parse(decodeURI(p));
        paint(performance_json);
    } else {
        $.getJSON("data.json", function (data) {
            $.each(data, function (key, val) {
                performance_json[key] = val;
            });
            paint(performance_json);
        });
    }

    $("#btnPaint").click( function() {
        $("#helpBlock").text();
        $("#helpBlock").addClass("hidden");
        var input_json = $('textarea#inputJson').val();
        try {
            var input_json_obj = $.parseJSON(input_json);
            //$(".chart g").remove();
            console.log(input_json_obj)
            paint(input_json_obj);
        } catch (e) {
            $("#helpBlock").text("Parsing JSON failed.");
            $("#helpBlock").addClass("hidden");
            $("#helpBlock").removeClass("hidden");
        }
    });

});
