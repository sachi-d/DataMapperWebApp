/**
 * Created by sachithra on 10/24/16.
 */

DataMapper.Views.TreeContainerView = DataMapper.Views.ContainerView.extend({
    el: "#canvas",
    id: "id",
    color: "#AABDBF",
    model: null,
    menu: "#dmcontainer-menu",
    drawInitContainer: function () {
        var self = this;
        var parent = d3.select("#canvas").append("g")
            .attr("id", this.id)
            .attr("class", "tree-dmcontainer dmcontainer dmcontainer-structure")
            .attr("transform", "translate(" + this.model.get('x') + "," + this.model.get('y') + ")");

        var height = this.model.get("nodeHeight") || this.model.nodeHeight;
        var width = this.model.get("containerWidth") || this.model.containerWidth;

        var titleOutline = parent.append("rect")
            .classed("dmcontainer-title-outline", true)
            .classed("dmcontainer-structure", true)
            .attr("x", 0).attr("y", -height)
            .attr("height", height)
            .attr("width", width)
            .attr("fill", this.color)
            .attr("stroke", "#000")
            .attr("id", this.id + "-title-outline")
            .attr("cursor", "move");

        var title = parent.append("text")
            .classed("dmcontainer-title", true)
            .classed("dmcontainer-structure", true)
            .attr("x", 0).attr("y", -5)
            .attr("font-weight", "bold")
            .text(this.model.get('title'))
            .attr("cursor", "move");

        var containerOutline = parent.append("rect")
            .classed("dmcontainer-outline", true)
            .classed("dmcontainer-structure", true)
            .attr("x", 0).attr("y", 0)
            .attr("height", height * 5)
            .attr("width", width)
            .attr("fill", "none")
            .attr("stroke", "#000");
        var fo = parent.append("foreignObject")
            .attr("x", 0).attr("y", 0)
            .attr("height", 100)
            .attr("width", 100)
            .style("display", "none");
        var input = fo.append("xhtml:input")
            .attr("type", "file")
            .classed("schema-select", true)
            .attr("name", "input-select[]")
            .attr("id", this.id + "-schema-select")
            .attr("accept", "application/json").style("display", "none")
            .on("change", function () {
                self.fileChange();
            });
        this.schemaSelect = input;
        return parent;
    }
    ,
    fileChange: function () {
        this.clearContainer();
        var e = d3.event;
        e.stopPropagation();
        e.preventDefault();
        // e.dataTransfer = e.originalTarget.dataTransfer;
        var files = e.target.files || e.dataTransfer.files;
        this.model.set('file', files[0]);
        this.model.readFile();
    }
    ,
    clearContainer: function () {
        Diagram.Connectors.clearConnectionsFromContainer(this.model.get('parent'));
        this.model.get('parent').selectAll(".nested-group").remove();
        this.model.set('nodeCollection', new DataMapper.Collections.NodeList());
        this.model.set('elementCount', 0);
        this.model.set('file', null);
        this.model.set('data', null);
    },
    addRootElement: function () {
        var self = this;
        BootstrapDialog.show({
            title: "Add root element",
            message: 'Title: <input id="title" type="text"><br>Type:<select id="type"><option value="object">Object</option><option value="array">Array</option></select>',
            draggable: true,
            buttons: [{
                label: 'Add root Element',
                cssClass: "btn-primary",
                action: function (dialogRef) {
                    self.model.createSchema(dialogRef.getModalBody().find('#title').val(), dialogRef.getModalBody().find('#type').val())
                    dialogRef.close();
                }
            },
                {
                    label: 'Cancel',
                    action: function (dialogRef) {
                        dialogRef.close();
                    }
                }
            ]
        });
    },
})
;

DataMapper.Models.TreeContainer = DataMapper.Models.Container.extend({
    defaults: {
        elementCount: 0
    },
    x: 0,
    y: 40,
    containerWidth: 300,
    nodeHeight: 20,
    file: '',
    data: null,
    type: "input",
    initialize: function () {
        this.set('nodeCollection', new DataMapper.Collections.NodeList());

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

                model.parseSchema(data);
            };
            reader.readAsText(this.get('file'));
        }
    },
    parseSchema: function (data) {
        this.set('data', data);
        var title = data.title || "Root";
        var count = this.traverseJSONSchema(data, title, 0, 0, this.get('parent'), null);
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
            if (count < 5) {
                count = 5;
            }
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
    traverseJSONSchema: function (root, rootName, level, rank, resultPane, parentNode) {
        var height = this.nodeHeight,
            width = this.containerWidth,
            margin = width / 6,
            x = 0,
            overhead = rank * margin,
            y = level * height,
            node = null;
        var tempParent = resultPane.append("g").attr("class", "nested-group");
        if (root.type === "object") {
            if (rootName !== "") {
                var nodeText = rootName;
                node = new DataMapper.Models.Node({
                    parent: tempParent,
                    parentNode: parentNode,
                    parentContainer: this,
                    text: nodeText,
                    textType: root.type,
                    x: x,
                    y: y,
                    type: this.get('type'),
                    category: "object",
                    isLeaf: false,
                    height: height,
                    width: width,
                    isSchema: true,
                    overhead: overhead
                });
                new DataMapper.Views.NodeView({model: node}).render();
                this.get('nodeCollection').add(node);
                rank++;
                level++;
            } else {
                node = parentNode;
            }
            var nestedParent = tempParent.append("g").attr("class", "nested-group");
            var keys = root.properties || {}; //select PROPERTIES
            for (var i = 0; i < Object.keys(keys).length; i++) {   //traverse through each PROPERTY of the object
                var keyName = Object.keys(keys)[i];
                var key = keys[keyName];
                level = this.traverseJSONSchema(key, keyName, level, rank, nestedParent, node);
            }

        } else if (root.type === "array") {
            var keys = root.items || {}; //select ITEMS
            if (rootName !== "") {
                var nodeText = rootName;
                node = new DataMapper.Models.Node({
                    parent: tempParent,
                    parentNode: parentNode,
                    parentContainer: this,
                    text: nodeText,
                    textType: root.type + "[" + keys.type + "]",
                    x: x,
                    y: y,
                    type: this.get('type'),
                    category: "array",
                    isLeaf: !keys.hasOwnProperty("properties"),
                    height: height,
                    width: width,
                    isSchema: true,
                    overhead: overhead
                });
                new DataMapper.Views.NodeView({model: node}).render();

                this.get('nodeCollection').add(node);
                rank++;
                level++;
            }
            if (keys.hasOwnProperty("properties")) {
                level = this.traverseJSONSchema(keys, "", level, rank, tempParent, node); //recurse through the items of array
            }
        } else if (["string", "integer", "number", "boolean"].indexOf(root.type) > -1) {    //when the type is a primitive
            //                        resultPane.classed("nested-group", false);
            tempParent.remove();
            if (rootName !== "") {
                var nodeText = rootName;
                var node = new DataMapper.Models.Node({
                    parent: resultPane,
                    parentNode: parentNode,
                    parentContainer: this,
                    text: nodeText,
                    textType: root.type,
                    x: x,
                    y: y,
                    type: this.get('type'),
                    category: "leaf",
                    isLeaf: true,
                    height: height,
                    width: width,
                    isSchema: true,
                    overhead: overhead
                });
                new DataMapper.Views.NodeView({model: node}).render();
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
    },

    createSchema: function (title, type) {
        var helperObj = type.toLowerCase() === "array" ? "items" : "properties";
        var newSchema = {
            "title": title,
            "type": type
        };
        newSchema[helperObj] = {};

        this.set('file', null);
        this.parseSchema(newSchema);
        console.log(newSchema);
    },
    addNode: function (trigNode, newTitle, newType, isChild) {


        var parentKey = isChild ? trigNode.get('text') : trigNode.get('parentNode').get('text');
        console.log(parentKey);
        var trigKey = trigNode.get('text');
        var valueTemplate = (function getTemplate(type) {
            var defaultVal = {"type": type};
            switch (type.toLowerCase()) {
                case "object":
                    defaultVal["properties"] = {};
                    break;
                case "array":
                    defaultVal["items"] = {"type": "object", "properties": {}};
                    break;
            }
            return defaultVal;
        })(newType);


        function addSibling(data, currentVal, newAt, newVal) {
            var sch = data;

            if (isChild) {
                console.log("jjj");
                data[newAt] = newVal;
            } else {
                Object.keys(data).some(function (k) {
                    if (k == currentVal) {
                        var cod = "\"" + k + "\":" + JSON.stringify(data[k]) + "";
                        var str = JSON.stringify(data);
                        str = str.replace(/("[^"]*")|\s/g, "$1");//remove whitespace
                        var arr = str.split(cod);
                        cod += ",\"" + newAt + "\":" + JSON.stringify(newVal);
                        console.log(arr[0] + "---" + cod + "---" + arr[1]);
                        sch = JSON.parse(arr[0] + cod + arr[1]);

                        return true;
                    }

                });
            }
            return sch;
        }


        var iterate = (function iter(o, search) {
            return Object.keys(o).some(function (k) {

                if ((k === search || o.title === search ) && o[k]) {
                    var p;
                    if (o.title) {
                        p = o;
                    } else {
                        p = o[k];
                    }
                    var newData = addSibling(p["properties"], trigKey, newTitle, valueTemplate);
                    // if (o[k]["properties"]) {
                    //     o[k]["properties"] = newData;
                    // } else if (o[k]["items"]["properties"]) {
                    //     o[k]["items"]["properties"] = newData;
                    // }
                    if (p.properties) {
                        p.properties = newData;
                    } else if (p.items.properties) {
                        p.items.properties = newData;
                    }
                    // console.log(newData);
                    return true;
                }
                if (o[k] !== null && typeof o[k] === 'object') {
                    return iter(o[k], search);
                }
            });
        })(this.get('data'), parentKey);


        // iter(this.get('data'), []); //updates path
        // console.log(this.get('data'));
        this.get('parent').selectAll(".nested-group").remove();
        this.parseSchema(this.get('data'));

    }
});

//BUG = LOADfILE ONCE, AGAIN LOAD FILE AGAIN AND CANCEL - TYPERROR - CAUSE "Onchange" listener