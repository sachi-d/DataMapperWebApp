/**
 * Created by sachithra on 10/19/16.
 */
DataMapper.Models.Connector = Backbone.Model.extend({
    sourceContainer: d3.select("#canvas"), //container
    sourceNode: null, //node (g)
    sourcePath: null,
    targetContainer: d3.select("#canvas"),
    targetNode: null,
    targetPath: null,
    line: null,
    status: 1,
    val: 5,
    initialize: function () {
        DataMapper.Connectors.add(this);
        //if the line is direct
        if (null !== this.get('line') && this.get('sourceContainer').classed("tree-dmcontainer") && this.get('targetContainer').classed("tree-dmcontainer")) {
            this.addDirectOperator();
        }
    },
    addDirectOperator: function () {
//                    var self = this;
        var operator = new DataMapper.Models.Operator({
            title: "directOperator",
            id: "direct" + DataMapper.Operators.length,
            inputCount: 1,
            outputCount: 1
        });
        var head = DataMapper.InputView.model.get('nodeCollection').getNodeFromDOMObject(this.get('sourceNode').node()).clone();
        var tail = DataMapper.OutputView.model.get('nodeCollection').getNodeFromDOMObject(this.get('targetNode').node()).clone();
        operator.get('nodeCollection').add([head, tail]);
        DataMapper.Operators.add(operator);
    },
    removeConnector: function () {
        this.get("line").remove();
        //TODO DataMapper.Connectors.remove(this);
    }
});
DataMapper.Models.Node = Backbone.Model.extend({//set parent, text, x,y, type,category
    defaults: {
        arrayId: 0,
        parent: d3.select("#canvas"),
        text: "",
        x: 0,
        y: 0,
        width: 170,
        height: 20,
        textType: "String",
        type: "", //input or output or null
        category: "leaf", //object, array or endType or operator,
        dotPosition: [],
        node: d3.select("#canvas")
    },
    initialize: function () {
        if (this.get('type') === "input") {
            this.set('dotPosition', [this.get('x') + this.get('width'), this.get('y') + this.get('height') / 2]);
        } else if (this.get('type') === "output") {
            this.set('dotPosition', [this.get('x'), this.get('y') + this.get('height') / 2]);
        }
//                    this.set('textType',this.get('text').split(":"));
    },
    drawNode: function () {
        //  function drawNode(container, parent, text, x, y, dotPosition, type) {
        var model = this;
        var height = this.get('height'),
            width = this.get('width');
        var parent1 = this.get('parent').append("g").attr("class", "node-element")
            .attr("x", this.get("x"))
            .attr("y", this.get("y"))
            .attr("height", height)
            .attr("width", width);
        this.set('node', parent1);

        //                    <foreignObject x="15" y="15" width="190" height="90">
        //                            <div xmlns="http://www.w3.org/1999/xhtml" style="width:190px; height:90px; overflow-y:auto"><b>This</b> is the <i>text</i> I wish to fit inside <code>rect</code></div>
        //                    </foreignObject>
        var text = parent1.append("text").attr("class", "node-element-text")
            .attr("x", this.get('x') + 12)
            .attr("y", this.get('y') + (3 * height / 4))
            .text(this.get('text') + ":" + this.get('textType'));
        if (this.get('category') === "operator") {
            this.drawOutline();
            text.attr("fill", "#989898");
        }
        if (this.get('dotPosition').length === 2) {
            parent1.classed("leaf-node", true);
            parent1.attr("type", this.get('type'));
            var anchor = new DataMapper.Models.Anchor({
                parent: parent1,
                cx: this.get('dotPosition')[0],
                cy: this.get('dotPosition')[1],
                type: this.get('type')
            });
            new DataMapper.Views.AnchorView({model: anchor});
        }

        return parent1;
    },
    drawContainerNode: function (overhead, isLeaf) {
        var obj = this.drawNode();
        obj.select("text").attr("x", this.get("x") + 12 + overhead);
        var model = this;
        obj.append("svg:image")
            .attr("x", this.get('x') + overhead)
            .attr("y", this.get('y') + 4)
            .attr("width", 11)
            .attr("height", 11)
            .attr("xlink:href", function () {
                if (model.get('category') === "object") {
                    return "assets/images/object-icon.png";
                } else if (model.get('category') === "array") {
                    return "assets/images/array-icon.png";
                }
                return "assets/images/leaf-icon.png";
            });
        if (!isLeaf) {
            obj.classed("parent-node", true);
            obj.classed("leaf-node", false);
            obj.select(".drag-head").remove();
        }
    },
    drawOutline: function () {
        this.get('node').append("rect")
            .attr("x", this.get('x'))
            .attr("y", this.get('y'))
            .attr("width", this.get('width'))
            .attr("height", this.get('height'))
            .attr("stroke", "black")
            .attr("fill", "none");
    }
});
DataMapper.Models.Anchor = Backbone.Model.extend({
    defaults: {
        parent: DataMapper.Canvas,
        cx: 0,
        cy: 0,
        width: 10,
        height: 10,
        points: "",
        type: "input"
    },
    dragAnchor: function () {
        var self = this;
        return d3.drag()
            .on("start", function (d) {
                var thisDragY = d3.select(this).attr("cy");
                var thisDragX = d3.select(this).attr("cx");
                var tempParent = d3.select(d3.select(this)["_groups"][0][0].parentNode);
                dragHead2 = self.drawDragArrow(tempParent, thisDragX, thisDragY);
                dragLine = tempParent.append("line").attr("class", "drag-line")
                    .style("stroke", "black")
                    .style("stroke-width", "2");
                dragLine.attr("x1", thisDragX)
                    .attr("x2", thisDragX)
                    .attr("y1", thisDragY)
                    .attr("y2", thisDragY);
            })
            .on("drag", function (d) {
                coordinates = d3.mouse(this);
                xx = coordinates[0];
                yy = coordinates[1];
                dragLine.attr("x2", xx).attr("y2", yy);
                self.moveArrow(dragHead2, xx, yy);
            })
            .on("end", function (d) {
                var sourceContainer = self.getParentContainer(d3.select(this));
                var sourceNode = d3.select(d3.select(this)["_groups"][0][0].parentNode);
                target = self.detectDropNode(xx, yy, sourceNode.attr("type"), sourceContainer);
                if (target) {
                    //limit the connections to one - in output targets
                    if (target.attr("type") === "output") {
                        //loop through connectors to find targetNode=target and remove line
                        var duplicate = DataMapper.Connectors.findFromTarget(target) || null;
                        if (duplicate !== null) {
                            duplicate.get('line').remove();
                            DataMapper.Connectors.remove(duplicate);
                        }
                    }
                    var oppositeContainer = self.getParentContainer(target);
                    var dotx = Number(target.select(".drag-head").attr("cx")) + self.getTranslateX(oppositeContainer) - self.getTranslateX(sourceContainer);
                    var doty = Number(target.select(".drag-head").attr("cy")) + self.getTranslateY(oppositeContainer) - self.getTranslateY(sourceContainer);
                    dragLine
                        .attr("x2", dotx)
                        .attr("y2", doty)
                        .attr("target-dmcontainer", oppositeContainer.attr("id"));
                    dragHead2.remove();
                    var map = new DataMapper.Models.Connector({
                        sourceContainer: sourceContainer,
                        targetContainer: oppositeContainer,
                        sourceNode: sourceNode,
                        targetNode: target,
                        line: dragLine
                    });
                    if (oppositeContainer.classed("operator")) {
                        target.select("text").text(sourceNode.select("text").text().split(":")[0]).classed("op-node-text", true);
                    }
                } else {
                    //d3.select("#inputnode").text("");
                    dragLine.remove();
                    dragHead2.remove();
                }
            });
    },
    drawArrow: function () {
        var newArrow = this.get('parent').append("polygon").attr("class", "drag-head");
        this.moveArrow(newArrow, this.get('cx'), this.get('cy'));
        if (this.get('type') === "input") {
            newArrow.attr("fill", "#019999");
            newArrow.call(this.dragAnchor());
        } else {
            newArrow.attr("fill", "#c9c9c9");
        }
    },
    drawDragArrow: function (parent, cx, cy) {
        var newArrow = parent.append("polygon").attr("class", "drag-head-2");
        this.moveArrow(newArrow, cx, cy);
        return newArrow;
    },
    moveArrow: function (arrow, cx, cy) {
        arrow.attr("points", function () {
            var p0 = [Number(cx) - 5, Number(cy) - 5],
                p1 = [Number(cx) + 5, Number(cy)],
                p2 = [Number(cx) - 5, Number(cy) + 5];
            return p0[0] + "," + p0[1] + " " + p1[0] + "," + p1[1] + " " + p2[0] + "," + p2[1];
        })
            .attr("cx", cx)
            .attr("cy", cy);
    },
    getTranslation: function (transform) {
        // Create a dummy g for calculation purposes only. This will never
        // be appended to the DOM and will be discarded once this function
        // returns.
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        // Set the transform attribute to the provided string value.
        g.setAttributeNS(null, "transform", transform);
        // consolidate the SVGTransformList containing all transformations
        // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
        // its SVGMatrix.
        var matrix = g.transform.baseVal.consolidate().matrix;
        // As per definition values e and f are the ones for the translation.
        return [matrix.e, matrix.f];
    },
    getParentTransform: function (elementObject) { //parameter is an element in an object - inputs or outputs array
        var transform = d3.select(elementObject["_groups"][0][0].parentNode).attr("transform");
        return transform;
    },
    getTranslateX: function (sourceContainer) {
        return Number(this.getTranslation(sourceContainer.attr("transform"))[0]);
    },
    getTranslateY: function (sourceContainer) {
        return Number(this.getTranslation(sourceContainer.attr("transform"))[1]);
    },
    getParentContainer: function (nodeElement) { //a recursive method to find g.container of an element
        if (nodeElement.classed("dmcontainer")) {
            return nodeElement;
        } else {
            return this.getParentContainer(d3.select(nodeElement["_groups"][0][0].parentNode));
        }
    },
    detectDropNode: function (xx, yy, type, sourceContainer) { //detect if a drop is near opposite type of drag-head
        var flag = false, self = this;
        d3.select("#canvas").selectAll(".leaf-node").each(function () { //assuming every leaf node has an anchor
            if (!flag && d3.select(this).attr("type") === "output") {
                var anchor = d3.select(this).select(".drag-head");
                if (anchor !== null) {
                    var x = Number(anchor.attr("cx")) + self.getTranslateX(self.getParentContainer(d3.select(this))) - self.getTranslateX(sourceContainer);
                    var y = Number(anchor.attr("cy")) + self.getTranslateY(self.getParentContainer(d3.select(this))) - self.getTranslateY(sourceContainer);
                    if (self.pointInRect([xx, yy], x - 10, x + 10, y - 10, y + 10)) {
                        flag = d3.select(this);
                    }
                }
            }
        });
        return flag;
    },
    pointInRect: function (point, x1, x2, y1, y2) { //determines if the point(array of coord) is bouded by the rectangle

        if (point[0] > x1 && point[0] < x2) {
            //horizontally inside
            if (point[1] > y1 && point[1] < y2) {
                //vertically in
                return true;
            }
        }
        return false;
    }
});
DataMapper.Models.Operator = Backbone.Model.extend({
    title: "Operator",
    id: "id",
    inputCount: 0,
    outputCount: 0,
    inputType: "String",
    outputType: "String",
    inputs: [],
    outputs: [],
    parent: d3.select("canvas"),
    defaults: {
        x: 400,
        y: 40,
        leaves: [],
        height: 20,
        width: 120
    },
    nodeCollection: null,
    initialize: function () {
        this.set('nodeCollection', new DataMapper.Collections.NodeList());
    },
    dragContainer: function () {
        var self = this;
        return d3.drag()
            .on("start", function () {
            })
            .on("drag", function (d, i) {
                this.x = this.x || self.get('x');
                this.y = this.y || self.get('y');
                this.x += d3.event.dx;
                this.y += d3.event.dy;
                d3.select(this).attr("transform", "translate(" + this.x + "," + this.y + ")");
                self.updateConnections(d3.event.dx, d3.event.dy);
                self.resizeCanvas(this.x, this.y);
            })
            .on("end", function () {
                // resizeCanvas();
            });
    },
    drawContainer: function () {
        this.set('inputs', []);
        this.set('outputs', []);
        var canvas = DataMapper.Canvas;
        var parent = canvas.append("g").attr("class", "operator dmcontainer")
            .attr("id", this.get('id'))
            .attr("transform", "translate(" + this.get('x') + "," + this.get('y') + ")");
        this.set('parent', parent);
        var inputCount = this.get('inputCount'),
            outputCount = this.get('outputCount');
        var max = d3.max([inputCount, outputCount]);
        var opTitleOutline = parent.append("rect").attr("class", "dmcontainer-title-outline")
            .attr("width", 2 * this.get('width'))
            .attr("height", 20) //height of the rect title=20
            .attr("x", 0)
            .attr("y", 0)
            .attr("fill", "#C5E3FF")
            .attr("stroke", "black");
        var opTitle = parent.append("text").attr("class", "dmcontainer-title")
            .attr("font-weight", "bold")
            .attr("x", 0)
            .attr("y", 15)
            .text(this.get('title'));
        var opContainerOutline = parent.append("rect").attr("class", "dmcontainer-outline")
            .attr("width", 2 * this.get('width'))
            .attr("height", max * this.get('height'))
            .attr("x", 0)
            .attr("y", 20)
            .attr("fill", "none")
            .attr("stroke", "black");
        var inputs = parent.append("g").attr("class", "op-inputs");
        var outputs = parent.append("g").attr("class", "op-outputs");
        var x = 0,
            y = Number(opTitleOutline.attr("height"));
        if (inputCount !== 0) {
            var tempHeight = this.get('height');
            if (max !== inputCount) {
                tempHeight = (max * this.get('height') / inputCount);
            }
            for (var i = 0; i < inputCount; i++) {
                var tempY = y + i * tempHeight;
                var node = new DataMapper.Models.Node({
                    parent: inputs,
                    text: "",
                    textType: this.get('inputType'),
                    x: x,
                    y: tempY,
                    type: "output",
                    category: "operator",
                    height: tempHeight,
                    width: this.get('width')
                });
                var obj = node.drawNode();
                obj.attr("rank", i);
                this.get('inputs').push(obj);
                this.get('nodeCollection').add(node);
            }

            x += this.get('width');
        }
        if (outputCount !== 0) {
            var tempHeight = this.get('height');
            if (max !== outputCount) {
                tempHeight = (max * this.get('height') / outputCount);
            }
            for (var i = 0; i < outputCount; i++) {
                var tempY = y + i * tempHeight;
                var node = new DataMapper.Models.Node({
                    parent: outputs,
                    text: "",
                    textType: this.get('outputType'),
                    x: x,
                    y: tempY,
                    type: "input",
                    category: "operator",
                    height: tempHeight,
                    width: this.get('width')
                });
                var obj = node.drawNode();
                obj.attr("rank", i);
                this.get('outputs').push(obj);
                this.get('nodeCollection').add(node);
            }
        }
        parent.call(this.dragContainer());
    },
    updateConnections: function (newX, newY) {
        var sourceContainer = this.get('parent');
        sourceContainer.selectAll(".drag-line")
            .attr("x2", function () {
                return d3.select(this).attr("x2") - newX;
            })
            .attr("y2", function () {
                return d3.select(this).attr("y2") - newY;
            });
        d3.select("#canvas").selectAll(".dmcontainer").each(function () {
            if (d3.select(this).attr("id") !== sourceContainer.attr("id")) {
                var opposite = d3.select(this);
                opposite.selectAll(".drag-line").each(function () {
                    if (d3.select(this).attr("target-dmcontainer") === sourceContainer.attr("id")) {
                        d3.select(this)
                            .attr("x2", function () {
                                return Number(d3.select(this).attr("x2")) + Number(newX);
                            })
                            .attr("y2", function () { //TODO drag misplaces the new y value
//                                                console.log(newY);
//                                                console.log(Number(d3.select(this).attr("y2")) + Number(newY));
                                return Number(d3.select(this).attr("y2")) + Number(newY);
                            });
                    }
                });
            }
        });
    },
    resizeCanvas: function (x, y) {
        var tempY = Number(this.get('parent').select(".dmcontainer-outline").attr("height")) + y,
            tempX = Number(this.get('parent').select(".dmcontainer-outline").attr("width")) + x;
        if (d3.select("#canvas").attr("width") < tempX) {
            d3.select("#canvas").attr("width", tempX);
        }
        if (d3.select("#canvas").attr("height") < tempY) {
            d3.select("#canvas").attr("height", tempY);
        }
    }
});
DataMapper.Models.TreeContainer = DataMapper.Models.Operator.extend({
    elementCount: 7,
    x: 0,
    y: 40,
    containerWidth: 300,
    nodeHeight: 20,
    file: '',
    data: null,
    type: "input",
    drawContainer: function () {
        this.set('tempParent', this.get('parent'));
        this.readFile();

    },
    readFile: function () {
        var model = this;
        // display text
        if (this.get('file').name.endsWith(".json") || this.get('file').type === "application/json") {

            var reader = new FileReader();
            var data;
            reader.onload = function (e) {
                //parseJSON
                var text = e.target.result;
                data = JSON.parse(text);
                model.set('data', data);
                model.parseFile(data);
            };
            reader.readAsText(this.get('file'));
        }
    },
    parseFile: function (data) {
        var title = data.title || "Root";
        var count = this.traverseJSONSchema(data, title, 0, 0, this.get('tempParent'));
        this.set('elementCount', count);
        this.updateContainerHeight();
        this.updateContainerWidth();
    },
    updateContainerHeight: function () {
        var outline = this.get('parent').select(".dmcontainer-outline");
        var model = this;
        outline.attr("height", function () {
            var count = model.get('elementCount') || model.elementCount,
                height = model.get('nodeHeight') || model.nodeHeight;
            return (count) * height;
        });
    },
    updateContainerWidth: function (t) {
        var maxLength = this.containerWidth || this.get('containerWidth');
        var parent = this.get('parent');
        parent.selectAll("text").each(function () {
            var x = Number(d3.select(this).attr("x"));
            var len = d3.select(this).node().getComputedTextLength();
            maxLength = d3.max([maxLength, x + len]);
        });
        parent.select(".dmcontainer-outline").attr("width", maxLength);
        parent.select(".dmcontainer-title-outline").attr("width", maxLength);
        if (this.get('type') === "input") {
            parent.selectAll(".drag-head").each(function () {
                var cx = maxLength, cy = d3.select(this).attr("cy");
                d3.select(this).attr("points", function () {
                    var p0 = [Number(cx) - 5, Number(cy) - 5],
                        p1 = [Number(cx) + 5, Number(cy)],
                        p2 = [Number(cx) - 5, Number(cy) + 5];
                    return p0[0] + "," + p0[1] + " " + p1[0] + "," + p1[1] + " " + p2[0] + "," + p2[1];
                })
                    .attr("cx", cx)
                    .attr("cy", cy);
            });
        }
    },
    traverseJSONSchema: function (root, rootName, level, rank, resultPane) {
        var height = this.nodeHeight,
            width = this.containerWidth,
            margin = width / 6,
            x = 0,
            overhead = rank * margin,
            y = level * height;
        var tempParent = resultPane.append("g").attr("class", "nested-group");
        if (root.type === "object") {
            if (rootName !== "") {
                var nodeText = rootName;
                var node = new DataMapper.Models.Node({
                    parent: tempParent,
                    text: nodeText,
                    textType: root.type,
                    x: x,
                    y: y,
                    type: this.get('type'),
                    category: "object",
                    height: height,
                    width: width
                });
                node.drawContainerNode(overhead, false);
                this.get('nodeCollection').add(node);
                rank++;
                level++;
            }
            var nestedParent = tempParent.append("g").attr("class", "nested-group");
            var keys = root.properties; //select PROPERTIES
            for (var i = 0; i < Object.keys(keys).length; i++) {   //traverse through each PROPERTY of the object
                var keyName = Object.keys(keys)[i];
                var key = keys[keyName];
                level = this.traverseJSONSchema(key, keyName, level, rank, nestedParent);
            }

        } else if (root.type === "array") {
            var keys = root.items; //select ITEMS
            if (rootName !== "") {
                var nodeText = rootName;
                var node = new DataMapper.Models.Node({
                    parent: tempParent,
                    text: nodeText,
                    textType: root.type + "[" + keys.type + "]",
                    x: x,
                    y: y,
                    type: this.get('type'),
                    category: "array",
                    height: height,
                    width: width
                });
                node.drawContainerNode(overhead, !keys.hasOwnProperty("properties"));
                this.get('nodeCollection').add(node);
                rank++;
                level++;
            }
            if (keys.hasOwnProperty("properties")) {
                level = this.traverseJSONSchema(keys, "", level, rank, tempParent); //recurse through the items of array
            }
        } else if (["string", "integer", "number", "boolean"].indexOf(root.type) > -1) {    //when the type is a primitive
            //                        resultPane.classed("nested-group", false);
            tempParent.remove();
            if (rootName !== "") {
                var nodeText = rootName;
                var node = new DataMapper.Models.Node({
                    parent: resultPane,
                    text: nodeText,
                    textType: root.type,
                    x: x,
                    y: y,
                    type: this.get('type'),
                    category: "leaf",
                    height: height,
                    width: width
                });
                node.drawContainerNode(overhead, true);
                this.get('nodeCollection').add(node);
                rank++;
                level++;
            }
        }
        return level;
    },
    getPath: function (search) {
        function iter(o, p) {
            return Object.keys(o).some(function (k) {
                if (k === search && o[k]) {
                    path = p.concat(k).join('.');
                    return true;
                }
                if (o[k] !== null && typeof o[k] === 'object') {
                    return iter(o[k],
                        k === 'properties' && !o.title ? p : p.concat(k === 'properties' && o.title ? o.title : k));
                }
            });
        }
        var path;
        iter(this.get('data'), []);
        return path;
    }
});
