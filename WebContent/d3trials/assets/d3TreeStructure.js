
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
    targetarray.push({"text": rootNode.nodeName, "level": level, "leaf": isleaf, "type": "", "width": elementwidth, "height": elementheight});


    for (var i = 0; i < children.length; i++) {

        var child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            traverseTree(child, level + 1, targetarray);

        }

    }
}






//parse XML tree
function parseXMLTree(inputText, resultBox) {

//remove elements of the inputs and outputs
    resultBox.selectAll(".node-element-rect").remove();
    resultBox.selectAll(".node-element-text").remove();
    resultBox.selectAll(".nodedot").remove();
    resultBox.selectAll(".dragdot").remove();
    canvas.selectAll(".dragline").remove();
    parser = new DOMParser();


    var xmlDoc = parser.parseFromString(inputText, "text/xml");

    // documentElement always represents the root node
    var root = xmlDoc.documentElement;
    var targetarray = [];

    traverseTree(root, 0, targetarray);

    if (resultBox.attr("id").split("-")[0] === "input") {
        inputs = [];
        inputleaves = [];
        //define inputs array
        inputs = targetarray;
        //generate input leaves array
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].id=i;
            if (inputs[i].leaf) {
                inputleaves.push(inputs[i]);
            }
        }
        drawNodeStack(inputcontainer, inputstartx, inputstarty, verticalmargin, inputs, inputleaves, "RIGHT", "INPUT");

    } else if (resultBox.attr("id").split("-")[0] === "output") {
        outputs = [];
        outputleaves = [];
        outputs = targetarray;
        for (var i = 0; i < outputs.length; i++) {
            outputs[i].id=i;
            if (outputs[i].leaf) {
                outputleaves.push(outputs[i]);
            }
        }
        drawNodeStack(outputcontainer, outputstartx, outputstarty, verticalmargin, outputs, outputleaves, "LEFT", "OUTPUT");
    }
}



function detectDropNode(xx, yy, data) {
    var target = [0, 0];
    if (data[0].type === "INPUT") {   //if root is from input target is outputs
        target = outputleaves;
    } else {
        target = inputleaves;
    }
    var i;
    for (i = 0; i < target.length; i++) {
        var x = target[i].dot.cx,
                y = target[i].dot.cy,
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

//function addInput() {
//    inputs.push({"text": "newelement", "col": "red"});
//    drawNodeStack(inputcontainer, elementwidth, elementheight, inputstartx, inputstarty, verticalmargin, inputs, "RIGHT", "INPUT");
//}
//function addOutput() {
//    outputs.push({"text": "newelement", "col": "red"});
//    drawNodeStack(outputcontainer, elementwidth, elementheight, outputstartx, outputstarty, verticalmargin, outputs, "LEFT", "OUTPUT");
//}

function drawNodeStack(container, startX, startY, verticalmargin, data, leafdata, dotposition, type) {

    startY += 30;// skip space for title

    var coordinates, dragdot2, dragline,
            childcontainer = d3.select("#" + (container.attr("id") + "-2")),
            leafcontainer = d3.select("#" + (container.attr("id") + "-1"));



    var dragme = d3.drag()
            .on("start", function (d) {
                d3.select("#inputnode").text(d.text);
                var thisdragY = d3.select(this).attr("cy");
                var thisdragX = d3.select(this).attr("cx");
                var thisdragR = d3.select(this).attr("r");
                coordinates = [0, 0];
                dragdot2 = container.append("circle").attr("class", "dragdot")
                        .attr("cx", thisdragX)
                        .attr("cy", thisdragY)
                        .attr("r", thisdragR)
                        .attr("fill", "red");
                dragline = container.append("line").attr("class", "dragline")
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
                //dragdot2.attr("transform","translate("+xx+","+yy+")");

                //TODO if position is inside the outleafs - text color change
            })
            .on("end", function (d) {
                var target = detectDropNode(xx, yy, data);
                if (target !== "null") {
                    d3.select("#outputnode").text(target.text);
                    dragline.attr("x2", target.dotposition[0]).attr("y2", target.dotposition[1]);
                    dragdot2.remove();
                    connections.push({"source": d, "target": target, "line": dragline});
                    //    dragdot2.attr("cx", target.dotposition[0]).attr("cy", target.dotposition[1]);
                } else {
                    dragline.remove();
                    dragdot2.remove();
                }
            });



//    var inputleaf = container.selectAll(".node-element-rect")
//            .data(data)
//            .enter().append("rect")
//            .attr("class", "node-element-rect")
//            .attr("width", function (d) {
//                return d.width;
//            })
//            .attr("height", function (d) {
//                return d.height;
//            })
//            .attr("x", function (d) {
//                var myX = startX + (d.level * 20);
//                d.x = myX;
//                return myX;
//            })
//            .attr("y", function (d, i) {
//                var myY = startY + ((d.height + verticalmargin) * i);
//                d.y = myY;
//                d.dotposition = [0, 0];
//                if (dotposition === "RIGHT") {
//                    d.dotposition[0] = d.x + d.width;
//                } else if (dotposition === "LEFT") {
//                    d.dotposition[0] = d.x;
//                }
//
//                d.dotposition[1] = myY + (d.height) / 2;
//
//              
//                return myY;
//            })
//            .attr("stroke-width", "1")
//            .attr("fill", "none")
//            .attr("stroke", function (d) {
//                var index = d.level % (colorcode.length);
//                return colorcode[index];
//            });

    var inputtext = container.selectAll("text")
            .data(data)
            .enter().append("text").attr("class", "node-element-text")
            .attr("x", function (d) {
                d.type = type;  //set the type
                return startX + (d.level * 20);
            })
            .attr("y", function (d, i) {
                return  startY + ((d.height + verticalmargin) * i) + (d.height) / 2;
            })
            .each(function (d) {
                d.textnode = d3.select(this);
            })
            .text(function (d) {
                return d.text;
            });




    var inputnodedot = container.selectAll(".nodedot")
            .data(leafdata)
            .enter().append("circle").attr("class", "nodedot")
            .attr("r", function (d) {
                return d.height / 4;
            })
            .attr("cx", function (d) {
                if (dotposition === "RIGHT") {
                    return startX + (d.level * 20) + d.width;
                } else if (dotposition === "LEFT") {
                    return startX + (d.level * 20);
                }
                return 0;

            })
            .attr("cy", function (d, i) {
                return startY + ((d.height + verticalmargin) * d.id) + (d.height) / 2;
            })
            .attr("r", function (d) {
                return (d.height) / 5;
            })
            .attr("fill", "black")
            .each(function (d) {
                d.dot = d3.select(this);
            })
            .call(dragme);


    updateContainers();
    //d3.select("#trial").text(JSON.stringify(leafdata));

}
