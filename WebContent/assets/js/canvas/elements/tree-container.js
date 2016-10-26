/**
 * Created by sachithra on 10/24/16.
 */
DataMapper.Models.Operator = Backbone.Model.extend({
    title: "Operator",
    id: "id",
    inputCount: 0,
    outputCount: 0,
    inputs: [],
    outputs: [],
    parent: d3.select("canvas"),
    defaults: {
        x: 400,
        y: 40,
        leaves: [],
        height: 20,
        width: 120,
        color: "#f3f5f6"
    },
    nodeCollection: null,
    initialize: function () {
        this.set('id', this.get('title') + "-" + Diagram.Operators.length);
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
    drawOperatorContainer: function () {
        this.set('inputs', []);
        this.set('outputs', []);
        var canvas = d3.select(Diagram.Canvas.el);
        var parent = canvas.append("g").attr("class", "operator dmcontainer")
            .attr("id", this.get('id'))
            .attr("transform", "translate(" + this.get('x') + "," + this.get('y') + ")");
        this.set('parent', parent);
        var inputCount = this.get('inputCount'),
            outputCount = this.get('outputCount');
        var max = d3.max([inputCount, outputCount]);
        var opTitleOutline = parent.append("rect").attr("class", "dmcontainer-title-outline dmcontainer-structure")
            .attr("width", 2 * this.get('width'))
            .attr("height", 20) //height of the rect title=20
            .attr("x", 0)
            .attr("y", 0)
            .attr("fill", this.get('color'))
            .attr("stroke", "black")
            .attr("cursor", "move");
        var opTitle = parent.append("text").attr("class", "dmcontainer-title dmcontainer-structure")
            .attr("font-weight", "bold")
            .attr("x", 0)
            .attr("y", 15)
            .text(this.get('title'))
            .attr("cursor", "move");
        var opContainerOutline = parent.append("rect").attr("class", "dmcontainer-outline dmcontainer-structure")
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
                    textType: this.get('inputTypes')[i],
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
                    textType: this.get('outputTypes')[i],
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
        var canvas = d3.select(Diagram.Canvas.el);
        if (canvas.attr("width") < tempX) {
            canvas.attr("width", tempX);
        }
        if (canvas.attr("height") < tempY) {
            canvas.attr("height", tempY);
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
        //resize Canvas with the translate y value
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

DataMapper.Collections.Operators = Backbone.Collection.extend({
    model: DataMapper.Models.Operator,
    url: "/operators",
    getOperatorByID: function (id) {
        return this.find(function (item) {
            return item.get("id") === id;
        });
    }
});