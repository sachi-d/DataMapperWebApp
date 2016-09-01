  function drawNodeStack(container, elementwidth, elementheight, startX, startY, verticalmargin, data, dotposition, type) {
                var coordinates, dragdot2, dragline,
                        dotpositionABS = [0, 0],
                        childcontainer = d3.select("#" + (container.attr("id") + "-2"));
                if (dotposition === "RIGHT") {
                    dotpositionABS[0] = startX + elementwidth;
                } else if (dotposition === "LEFT") {
                    dotpositionABS[0] = startX;
                }
                dotpositionABS[1] = elementheight / 2 + startY;//updated later



                var dragme = d3.drag()
                        .on("start", function (d) {
                            var thisdragY = d3.select(this).attr("cy");
                            var thisdragX = d3.select(this).attr("cx");
                            var thisdragR = d3.select(this).attr("r");
                            coordinates = [0, 0];
                            dragdot2 = childcontainer.append("circle")
                                    .attr("cx", thisdragX)
                                    .attr("cy", thisdragY)
                                    .attr("r", thisdragR)
                                    .attr("fill", "black");
                            dragline = childcontainer.append("line")
                                    .attr("x1", thisdragX)
                                    .attr("x2", thisdragX)
                                    .attr("y1", thisdragY)
                                    .attr("y2", thisdragY)
                                    .style("stroke", d.col)
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
                                dragdot2.attr("cx", target.dotposition[0]).attr("cy", target.dotposition[1]);
                            } else {
                                dragline.remove();
                                dragdot2.remove();
                            }
                        });



                var inputleaf = container.selectAll("rect")
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
                            var myX = startX;
                            d.x = myX;
                            return myX;
                        })
                        .attr("y", function (d, i) {
                            var myY = startY + ((elementheight + verticalmargin) * i);
                            d.y = myY;
                            d.dotposition = [0, 0];
                            d.dotposition[0] = dotpositionABS[0]; //set the dot position
                            d.dotposition[1] = myY + (d.height) / 2;

                            d.type = type;  //set the type
                            return myY;
                        })
                        .attr("stroke-width", "2")
                        .attr("fill", "none")
                        .attr("stroke", function (d) {
                            return d.col;
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




                var inputdragdot = container.selectAll("circle")
                        .data(data)
                        .enter().append("circle").attr("r", elementheight / 4)
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

            }
