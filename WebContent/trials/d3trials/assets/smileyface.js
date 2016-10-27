var drag = d3.drag()
        .on("drag", function (d, i) {
            d.x += d3.event.dx
            d.y += d3.event.dy
            d3.select(this).attr("transform", function (d, i) {
                return "translate(" + [d.x, d.y] + ")"
            })
        });

function face_factory(classname, data, x, y, r)
{
    //data format
    //{ "x": 0 - 1 , "y": 0 -1, "z": 0-1 }
    //color could be made a parameter
    //var arc = d3.svg.arc().outerRadius(r)
    //var donut = d3.layout.pie();

    var face = d3.select("#charts")
            .append("svg:g")
            //.data([data.sort(d3.descending)])
            //.data([data])
            .data([{"x": x, "y": y}])
            .attr("class", classname)
            .attr("transform", "translate(" + x + "," + y + ")")
            .call(drag);


    console.log("make head");
    var head_color = d3.scaleLinear()
            .domain([0, 1])
            .interpolate(d3.interpolateRgb)
            .range(["#ff0000", "#0000ff"]);

    var head = face.append("svg:circle")
            .attr("class", "head")
            .attr("fill", function (d) {
                return head_color(data.x);
            })
            .attr("fill-opacity", .8)
            .attr("stroke", "#000")
            .attr("stroke-width", 4)
            .attr("r", r);

    console.log("make mouth");
    var mouth_x = [0, .5, 1];

    var mouth_x_range = d3.scaleLinear()
            .domain([0, 1])
            .range([-r / 2, r / 2]);

    var mouth_y_range = d3.scaleLinear()
            .domain([0, 1])
            .range([-r / 2, r / 2]);

    var mouth_y = [.5, data.y, .5];
    console.log(mouth_y)

    var mouth_line = d3.line()
            .x(function (d, i) {
                return mouth_x_range(mouth_x[i]);
            })
            .y(function (d, i) {
                return mouth_y_range(mouth_y[i]);
            })
            .curve("basis");

    /*
     var mouth = face.append("svg:path")
     .attr("class", "mouth")
     .attr("stroke", "#000")
     .attr("stroke-width", 4)
     .attr("fill", "none")
     .attr("transform", "translate(" + [0, r/3] + ")")
     .attr("d", mouth_line(mouth_x));
     */

    console.log("create eyes")
    var eyer = r / 10 + data.z * (r / 3);
    console.log(eyer);
    var left_eye = face.append("svg:circle")
            .attr("class", "eyes")
            .attr("stroke", "#000")
            .attr("fill", "none")
            .attr("stroke-width", 4)
            .attr("transform", "translate(" + [-r / 2.5, -r / 3] + ")")
            .attr("r", eyer);

    //eyer = r/10 + data.w * (r/3);
    var right_eye = face.append("svg:circle")
            .attr("class", "eyes")
            .attr("stroke", "#000")
            .attr("fill", "none")
            .attr("stroke-width", 4)
            .attr("transform", "translate(" + [r / 2.5, -r / 3] + ")")
            .attr("r", eyer);

    var text = face.append("svg:text")
            .text("SMILE!")
            .attr("y", ".5em")
            .attr("transform", "translate(" + [0, r / 3] + ")")
            .attr("text-anchor", "middle")
            .attr("font-weight", 700)
            .attr("font-family", "Helvetica")
            .attr("fill", "#ff0")
            .attr("stroke", "none")
            .attr("pointer-events", "none")

}

var w = 700;
var h = 400;



//setup svg canvas
d3.select("body")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "charts")
        //.on("click", clickypie)
        .append("svg:rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("stroke", "#000")
        .attr("stroke-width", 3)
        .attr("fill", "none")

//r = 100;
for (i = 0; i < 20; i++)
{
    var r = 20 + Math.random() * 50;
    var data = {"x": Math.random(), "y": Math.random(), "z": Math.random(), "w": Math.random()};
    x = Math.random() * w
    y = Math.random() * h
    face_factory("face" + i, data, x, y, r);
}