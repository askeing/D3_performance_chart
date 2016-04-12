/**
 * Created by Askeing on 16/4/11.
 */
// Ref: https://www.w3.org/TR/navigation-timing/#processing-model

function drawLine(sel, val, height, class_name, root) {
    root.selectAll(sel)
        .append("line")
        .attr("x1", val)
        .attr("x2", val)
        .attr("y1", 0)
        .attr("y2", height)
        .attr("class", "data " + class_name);
}

function drawRect(sel, val, x_offset, height, class_name, root) {
    root.selectAll(sel).append("rect")
        .attr("x", x_offset)
        .attr("width", val)
        .attr("height", height)
        .attr("class", "data " + class_name);
}

function getTimeIntervalArray(performance_json, has_redirect) {
    var ret = [];
    // navigationStart
    ret.push(performance_json["navigationStart"] + " ms");
    // redirect
    if (has_redirect) {
        ret.push(performance_json["redirectStart"] + "~" + performance_json["redirectEnd"] + " ms");
    }
    // fetchStart
    ret.push(performance_json["fetchStart"] + " ms");
    // domainLookup
    ret.push(performance_json["domainLookupStart"] + "~" + performance_json["domainLookupEnd"] + " ms");
    // connect
    ret.push(performance_json["connectStart"] + "~" + performance_json["connectEnd"] + " ms");
    // requestStart
    ret.push(performance_json["requestStart"] + " ms");
    // response
    ret.push(performance_json["responseStart"] + "~" + performance_json["responseEnd"] + " ms");
    // domLoading
    ret.push(performance_json["domLoading"] + " ms");
    // domInteractive
    ret.push(performance_json["domInteractive"] + " ms");
    // domContentLoaded
    ret.push(performance_json["domContentLoadedEventStart"] + "~" + performance_json["domContentLoadedEventEnd"] + " ms");
    // domComplete
    ret.push(performance_json["domComplete"] + " ms");
    // loadEvent
    ret.push(performance_json["loadEventStart"] + "~" + performance_json["loadEventEnd"] + " ms");
    return ret;
}

function getTimeSliceArray(performance_json, has_redirect) {
    var ret = [];
    // navigationStart
    ret.push("0 ms");
    // redirect
    if (has_redirect) {
        ret.push((performance_json["redirectEnd"] - performance_json["redirectStart"]) + " ms");
    }
    // fetchStart
    ret.push("0 ms");
    // domainLookup
    ret.push((performance_json["domainLookupEnd"] - performance_json["domainLookupStart"]) + " ms");
    // connect
    ret.push((performance_json["connectEnd"] - performance_json["connectStart"]) + " ms");
    // requestStart
    ret.push("0 ms");
    // response
    ret.push((performance_json["responseEnd"] - performance_json["responseStart"]) + " ms");
    // domLoading
    ret.push("0 ms");
    // domInteractive
    ret.push("0 ms");
    // domContentLoaded
    ret.push((performance_json["domContentLoadedEventEnd"] - performance_json["domContentLoadedEventStart"]) + " ms");
    // domComplete
    ret.push("0 ms");
    // loadEvent
    ret.push((performance_json["loadEventEnd"] - performance_json["loadEventStart"]) + " ms");
    return ret;
}

function paint(performance_json) {
    // Check the redirect value, if it's zero, then skip painting the information of redirect.
    var has_redirect = true;
    if (!(performance_json["redirectStart"]) || (performance_json["redirectStart"] == 0)) {
        has_redirect = false;
    }

    // Normalize the performance data
    var baseline = performance_json["navigationStart"];
    for (var item in performance_json) {
        performance_json[item] = performance_json[item] - baseline;
    }

    // Get the max range.
    var max_range = performance_json["loadEventEnd"] - performance_json["navigationStart"];

    // There are 13 columns when has redirect, and 12 columns when no redirect.
    var labels = ["navigationStart", "redirect", "fetchStart", "domainLookup", "connect",
        "requestStart", "response",
        "domLoading", "domInteractive", "domContentLoaded", "domComplete", "loadEvent"];
    if (!has_redirect) {
        labels = ["navigationStart", "fetchStart", "domainLookup", "connect",
            "requestStart", "response",
            "domLoading", "domInteractive", "domContentLoaded", "domComplete", "loadEvent"];
    }

    // Get the offset and range of each steps.
    // 1. Network Steps
    var _network_array = [performance_json["navigationStart"], performance_json["fetchStart"], performance_json["domainLookupStart"], performance_json["domainLookupEnd"], performance_json["connectStart"], performance_json["connectEnd"]];
    var _network_min = Math.min.apply(Math, _network_array);
    var _network_max = Math.max.apply(Math, _network_array);
    var _network_range = _network_max - _network_min;
    var _network_offset = _network_min;
    // 2. Request Steps
    var _connect_array = [performance_json["requestStart"], performance_json["responseStart"], performance_json["responseEnd"]];
    var _connect_min = Math.min.apply(Math, _connect_array);
    var _connect_max = Math.max.apply(Math, _connect_array);
    var _request_range = _connect_max - _connect_min;
    var _request_offset = _connect_min;
    // 3. DOM Steps
    var _dom_array = [performance_json["domLoading"], performance_json["domInteractive"], performance_json["domContentLoadedEventStart"], performance_json["domContentLoadedEventEnd"], performance_json["loadEventStart"], performance_json["loadEventEnd"], performance_json["domComplete"]];
    var _dom_min = Math.min.apply(Math, _dom_array);
    var _dom_max = Math.max.apply(Math, _dom_array);
    var _dom_range = _dom_max - _dom_min;
    var _dom_offset = _dom_min;

    // Set up the SVG width and bar height.
    var full_width = 600,
        width = 360,
        bar_height = 20;

    // Scale SVG
    var x = d3.scale.linear()
        .domain([0, max_range])
        .range([0, width]);

    // Set up Chart
    var chart = d3.selectAll(".chart g")
        .remove();
    var chart = d3.select(".chart")
        .attr("width", full_width)
        .attr("height", bar_height * labels.length);

    // Generate bar layer
    var bar = chart.selectAll("g")
        .data(labels)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * bar_height + ")"; });
    if (has_redirect) {
        bar.attr("class", function(d, i) {
            if (0<=i && i<2) return "n n" + (i+1);
            if (2<=i && i<5) return "n f f" + (i-1);
            if (5<=i && i<7) return "r r" + (i-4);
            if (7<=i && i<12) return "d d" + (i-6);
        });
    } else {
        bar.attr("class", function(d, i) {
            if (0<=i && i<1) return "n n" + (i+1);
            if (1<=i && i<4) return "n f f" + (i);
            if (4<=i && i<6) return "r r" + (i-3);
            if (6<=i && i<11) return "d d" + (i-5);
        });
    }

    // Draw background bar, and add text labels
    bar.append("rect")
        .attr("width", width)
        .attr("height", bar_height - 1)
        .attr("class", "background");
    bar.append("text")
        .attr("x", width + 3 )
        .attr("y", bar_height / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d; });

    // Draw Network Steps bg
    var n_bar = chart.selectAll("g.n");
    n_bar.append("rect")
        .attr("x", x(_network_offset))
        .attr("width", x(_network_range))
        .attr("height", bar_height - 2)
        .attr("class", "step network_background");
    // Draw Request Steps bg
    var c_bar = chart.selectAll("g.r");
    c_bar.append("rect")
        .attr("x", x(_request_offset))
        .attr("width", x(_request_range))
        .attr("height", bar_height - 2)
        .attr("class", "step request_background");
    // Draw DOM Steps bg
    var d_bar = chart.selectAll("g.d");
    d_bar.append("rect")
        .attr("x", x(_dom_offset))
        .attr("width", x(_dom_range))
        .attr("height", bar_height - 2)
        .attr("class", "step dom_background");

    var _tmp_var = 0;
    // Network Data
    // navigationStart
    drawLine("g.n1", x(performance_json["navigationStart"]), bar_height - 2, "network_data", chart);
    // redirect
    if (has_redirect) {
        _tmp_var = (performance_json["redirectEnd"] - performance_json["redirectStart"]);
        if(x(_tmp_var) < 1) {
            drawLine("g.n2", x(performance_json["redirectEnd"]), bar_height - 2, "network_data", chart);
        } else {
            drawRect("g.n2", x(_tmp_var), x(performance_json["redirectStart"]), bar_height - 2, "network_data", chart);
        }
    }
    // fetchStart
    drawLine("g.f1", x(performance_json["fetchStart"]), bar_height - 2, "network_data", chart);
    // domainLookup
    _tmp_var = (performance_json["domainLookupEnd"] - performance_json["domainLookupStart"]);
    if(x(_tmp_var) < 1) {
        drawLine("g.f2", x(performance_json["domainLookupEnd"]), bar_height - 2, "network_data", chart);
    } else {
        drawRect("g.f2", x(_tmp_var), x(performance_json["domainLookupStart"]), bar_height - 2, "network_data", chart);
    }
    // connect
    _tmp_var = (performance_json["connectEnd"] - performance_json["connectStart"]);
    if(x(_tmp_var) < 1) {
        drawLine("g.f3", x(performance_json["connectEnd"]), bar_height - 2, "network_data", chart);
    } else {
        drawRect("g.f3", x(_tmp_var), x(performance_json["connectStart"]), bar_height - 2, "network_data", chart);
    }

    // Request Data
    // requestStart
    drawLine("g.r1", x(performance_json["requestStart"]), bar_height - 2, "request_data", chart);
    // response
    _tmp_var = (performance_json["responseEnd"] - performance_json["responseStart"]);
    if(x(_tmp_var) < 1) {
        drawLine("g.r2", x(performance_json["responseEnd"]), bar_height - 2, "request_data", chart);
    } else {
        drawRect("g.r2", x(_tmp_var), x(performance_json["responseStart"]), bar_height - 2, "request_data", chart);
    }
    
    // DOM data
    // domLoading
    drawLine("g.d1", x(performance_json["domLoading"]), bar_height - 2, "dom_data", chart);
    // domInteractive
    drawLine("g.d2", x(performance_json["domInteractive"]), bar_height - 2, "dom_data", chart);
    // domContentLoaded
    _tmp_var = (performance_json["domContentLoadedEventEnd"] - performance_json["domContentLoadedEventStart"]);
    if(x(_tmp_var) < 1) {
        drawLine("g.d3", x(performance_json["domContentLoadedEventEnd"]), bar_height - 2, "dom_data", chart);
    } else {
        drawRect("g.d3", x(_tmp_var), x(performance_json["domContentLoadedEventStart"]), bar_height - 2, "dom_data", chart);
    }
    // domComplete
    drawLine("g.d4", x(performance_json["domComplete"]), bar_height - 2, "dom_data", chart);
    // loadEvent
    _tmp_var = (performance_json["loadEventEnd"] - performance_json["loadEventStart"]);
    if(x(_tmp_var) < 1) {
        drawLine("g.d5", x(performance_json["loadEventEnd"]), bar_height - 2, "dom_data", chart);
    } else {
        drawRect("g.d5", x(_tmp_var), x(performance_json["loadEventStart"]), bar_height - 2, "dom_data", chart);
    }

    // Draw the time interval information
    var _time_interval = getTimeIntervalArray(performance_json, has_redirect);
    chart.selectAll("g")
        .data(_time_interval)
        .append("text")
        .attr("x", width + 120 + 3 )
        .attr("y", bar_height / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d; });

    // Draw the time slice tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    var _time_slice = getTimeSliceArray(performance_json, has_redirect);
    chart.selectAll(".step")
        .data(_time_slice)
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9)
                .style("z-index", 3);
            div	.html(d)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
    chart.selectAll(".data")
        .data(_time_slice)
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9)
                .style("z-index", 3);
            div	.html(d)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
}
