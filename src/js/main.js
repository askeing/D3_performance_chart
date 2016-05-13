/**
 * Created by Askeing on 16/4/11.
 */

function getParameter(parameter_name) {
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

function generateLink(performance_json) {
    var link_prefix = window.location.href;
    var link_data = encodeURI(performance_json);
    var link_url = link_prefix + '?p=' + link_data + '&ref=link';
    var link = $('#refLink');
    link.attr('href', link_url);
    link.removeClass('hidden');
}

$(document).ready(function() {

    var performance_json = new Object();

    var p = getParameter("p");
    if (p) {
        var p_json = decodeURI(p);
        performance_json = JSON.parse(p_json);
        $('textarea#inputJson').val(p_json);
        window.history.pushState("Performance Timing", "Performance", window.location.origin + window.location.pathname);
        paint(performance_json);
        generateLink(p_json);
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
            generateLink(input_json);
        } catch (e) {
            $("#helpBlock").text("Parsing JSON failed.");
            $("#helpBlock").addClass("hidden");
            $("#helpBlock").removeClass("hidden");
        }
    });

});
