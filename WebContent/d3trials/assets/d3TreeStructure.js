
//traverse XML tree
function traverseTree(rootNode, level, targetarray) {
    if (rootNode.nodeType !== Node.ELEMENT_NODE) {
        return;
    }
    var children = rootNode.childNodes;
    var isleaf = false;

    if (children.length === 1) {
        isleaf = true;
    }
    targetarray.push({"text": rootNode.nodeName, "level": level, "x": 0, "y": 0, "height": 0, "width": 0, "dotposition": [0, 0], "leaf": isleaf, "type": ""});


    for (var i = 0; i < children.length; i++) {

        var child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            traverseTree(child, level + 1, targetarray);

        }

    }
}






//parse XML tree
function parseXMLTree(inputText, resultBox) {
//    $("#" + resultBox).empty();
    resultBox.selectAll("rect").remove();
    parser = new DOMParser();


    var xmlDoc = parser.parseFromString(inputText, "text/xml");

    // documentElement always represents the root node
    var root = xmlDoc.documentElement;
    var targetarray = [];

    traverseTree(root, 0, targetarray);

    if (resultBox.attr("id").split("-")[0] === "input") {
        inputs = targetarray;
        drawNodeStack(inputcontainer, elementwidth, elementheight, inputstartx, inputstarty, verticalmargin, inputs, "RIGHT", "INPUT");
    } else if (resultBox.attr("id").split("-")[0] === "output") {
        outputs = targetarray;
        drawNodeStack(outputcontainer, elementwidth, elementheight, outputstartx, outputstarty, verticalmargin, outputs, "LEFT", "OUTPUT");
    }
}



function detectDropNode(xx, yy, data) {
    var target = [0, 0];
    if (data[0].type === "INPUT") {   //if root is from input target is outputs
        target = outputs;
    } else {
        target = inputs;
    }
    var i;
    for (i = 0; i < target.length; i++) {
        var x = target[i].x,
                y = target[i].y,
                width = target[i].width,
                height = target[i].height;
        if (xx > x && xx < x + width) { //check whether horizontally in
            if (yy > y && yy < y + height) { //check whether vertically in
                return target[i];
            }
        }
    }
    return "null";
}

function addInput() {
    inputs.push({"text": "newelement", "col": "red"});
    drawNodeStack(inputcontainer, elementwidth, elementheight, inputstartx, inputstarty, verticalmargin, inputs, "RIGHT", "INPUT");
}
function addOutput() {
    outputs.push({"text": "newelement", "col": "red"});
    drawNodeStack(outputcontainer, elementwidth, elementheight, outputstartx, outputstarty, verticalmargin, outputs, "LEFT", "OUTPUT");
}

function drawNodeStack(container, elementwidth, elementheight, startX, startY, verticalmargin, data, dotposition, type) {

var leafdata=[];
for(var i=0;i<data.length;i++){
    if(data[i].leaf){
        leafdata.push(data[i]);
    }
}

    var coordinates, dragdot2, dragline,
            childcontainer = d3.select("#" + (container.attr("id") + "-2")),
            leafcontainer = d3.select("#" + (container.attr("id") + "-1"));



    var dragme = d3.drag()
            .on("start", function (d) {
                var thisdragY = d3.select(this).attr("cy");
                var thisdragX = d3.select(this).attr("cx");
                var thisdragR = d3.select(this).attr("r");
                coordinates = [0, 0];
                dragdot2 = childcontainer.append("circle").attr("class", "dragdot")
                        .attr("cx", thisdragX)
                        .attr("cy", thisdragY)
                        .attr("r", thisdragR)
                        .attr("fill", "red");
                dragline = childcontainer.append("line").attr("class", "dragline")
                        .attr("x1", thisdragX)
                        .attr("x2", thisdragX)
                        .attr("y1", thisdragY)
                        .attr("y2", thisdragY)
                        .style("stroke", "black")
                        .style("stroke-width", "2");
            })
            .on("drag", function (d) {
                coordinates = d3.mouse(this);
                xx = coordinates[0];
                yy = coordinates[1];
                dragline.attr("x2", xx).attr("y2", yy);
                dragdot2.attr("cx", xx).attr("cy", yy);

                //if position is inside the outleafs - stroke color change
            })
            .on("end", function (d) {
                var target = detectDropNode(xx, yy, data);
                if (target !== "null") {
                    d3.select("#trial").text(target.text);
                    dragline.attr("x2", target.dotposition[0]).attr("y2", target.dotposition[1]);
                    dragdot2.remove();
                    //    dragdot2.attr("cx", target.dotposition[0]).attr("cy", target.dotposition[1]);
                } else {
                    dragline.remove();
                    dragdot2.remove();
                }
            });



    var inputleaf = container.selectAll("rect").attr("class", "input-leaf")
            .data(data)
            .enter().append("rect")
            .attr("class", "input-leaf")
            .attr("width", function (d) {
                d.width = elementwidth;
                return elementwidth;
            })
            .attr("height", function (d) {
                d.height = elementheight;
                return elementheight;
            })
            .attr("x", function (d) {
                var myX = startX + (d.level * 20);
                d.x = myX;
                return myX;
            })
            .attr("y", function (d, i) {
                var myY = startY + ((elementheight + verticalmargin) * i);
                d.y = myY;
                d.dotposition = [0, 0];
                if(dotposition==="RIGHT"){
                    d.dotposition[0]=d.x+d.width;
                }else if(dotposition==="LEFT"){
                    d.dotposition[0]=d.x;
                }
                
                d.dotposition[1] = myY + (d.height) / 2;

                d.type = type;  //set the type
                return myY;
            })
            .attr("stroke-width", "1")
            .attr("fill", "none")
            .attr("stroke", function (d) {
                var index = d.level % (colorcode.length);
                return colorcode[index];
            });

    var inputtext = container.selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d, i) {
                return d.y + (d.height) / 2;
            })
            .text(function (d) {
                return d.text;
            });




    var inputnodedot = leafcontainer.selectAll(".nodedot")
            .data(leafdata)
            .enter().append("circle").attr("class", "nodedot")
            .attr("r", elementheight / 4)
            .attr("cx", function (d) {
                return d.dotposition[0];
            })
            .attr("cy", function (d, i) {
                return d.dotposition[1];
            })
            .attr("r", function (d) {
                return (d.height) / 5;
            })
            .attr("fill", "black")
            .call(dragme);

    d3.select("#trial").text(JSON.stringify(leafdata));

}
