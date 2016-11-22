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

        return parent;
    },
    fileChange: function (type, loadFile) {
        this.clearContainer();
        this.model.set('file', loadFile);
        this.model.set('fileType', type);
        this.model.readFile();
    },
    clearContainer: function () {
        Diagram.Connectors.clearConnectionsFromContainer(this.model.get('parent'));
        this.model.get('parent').selectAll(".nested-group").remove();
        this.model.set('nodeCollection', new DataMapper.Collections.NodeList());
        this.model.set('elementCount', 0);
        this.model.set('file', null);
        this.model.set('data', null);
        this.model.updateContainerHeight();
        this.model.updateContainerWidth();
    },
    addRootElement: function () {
        var self = this;
        BootstrapDialog.show({
            title: "Add root element",
            message: 'Title: <input id="title" type="text"><br>Type: Object',
            draggable: true,
            buttons: [{
                    label: 'Add root Element',
                    cssClass: "btn-primary",
                    action: function (dialogRef) {
                        self.model.createSchema(dialogRef.getModalBody().find('#title').val());
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

    loadFile: function () {
        var self = this;
        var optionList = [
            {
                name: "XML",
                id: "xml",
                extension: ".xml"
            },
            {
                name: "JSON",
                id: "json",
                extension: ".json"
            },
            {
                name: "CSV",
                id: "csv",
                extension: ".csv"
            }, {
                name: "XSD",
                id: "xsd",
                extension: ".xsd"
            }, {
                name: "JSON Schema",
                id: "jsonschema",
                extension: ".json"
            },
            {
                name: "Connector",
                id: "connector",
                extension: "*"
            }
        ];
        var typeOptions = (function (arr) {
            var str = "";
            arr.map(function (type) {
                var op = "<option value=" + type.id + " data-ext=" + type.extension + " >" + type.name + "</option>";
                str += op;
            });
            return str;
        })(optionList);

        //event listener to capture type change and set file extension
        $(document).on("change", '#load-file-type', function (event) {
            var getType = $(this).find('option:selected').attr('data-ext');
            //            console.log(getType);
            $('#load-file').attr('accept', getType);
            //            console.log($('#load-file').attr('accept'));
        });

        BootstrapDialog.show({
            title: "Load file",
            message: ' Type: <select id="load-file-type"  >' + typeOptions + ' </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  File: <input id="load-file" type="file" style="display:inline" accept=".xml" >',
            draggable: true,
            buttons: [{
                    label: 'Load',
                    cssClass: "btn-primary",
                    action: function (dialogRef) {
                        var fileType = dialogRef.getModalBody().find('#load-file-type').val();
                        var fileSelect = dialogRef.getModalBody().find('#load-file')[0].files[0];
                        if (fileSelect) {
                            var tempType1 = "." + fileSelect.name.split(".").pop();
                            var tempType2 = dialogRef.getModalBody().find('#load-file-type')[0].selectedOptions[0].dataset.ext;
                            if (tempType1 !== tempType2) {
                                alert("Mismatching file types");
                            } else {
                                self.fileChange(fileType, fileSelect);
                                dialogRef.close();
                            }
                        } else {
                            alert("Empty file");
                        }
                        //                        dialogRef.close();
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
    }
});

DataMapper.Models.TreeContainer = DataMapper.Models.Container.extend({
    defaults: {
        elementCount: 0
    },
    x: 0,
    y: 40,
    containerWidth: 300,
    nodeHeight: 20,
    rankMargin: 50,
    file: '',
    fileType: 'schema',
    data: null,
    type: "input",
    initialize: function () {
        this.set('nodeCollection', new DataMapper.Collections.NodeList());
    },
    getJSONschema: function (fileText) {
        var type = this.get('fileType');
        var filename = this.get('file').name;
        var schemaOutput = {
            jsonschema: function () {
                return JSON.parse(fileText);
            },
            json: function () {
                var m = Schemify.JSONtoJSONSchema(JSON.parse(fileText));
                return m;
            },
            csv: function () {
                var m = CSVParser.parse(fileText, true, ",", false, false, ".");
                var newSchema = {
                    "title": "csv root",
                    "type": "object",
                    "properties": {}
                };
                m.headerNames.map(function (header, index) {
                    newSchema.properties[header] = {
                        "type": m.headerTypes[index]
                    };
                });
                return newSchema;
            },
            xml: function () {
                var jsonObj = xml2json(fileText);
                //                console.log(JSON.stringify(jsonObj, null, 4));
                //                var dd = Schemify.XMLtoJSONSchema(fileText);
                var dd = Schemify.JSONtoJSONSchema(jsonObj);
                console.log(JSON.stringify(jsonObj, null, 4));
                return dd;
            },
            xsd: function () {
                var sch = Schemify.XMLtoJSONSchema(fileText);
                //                console.log(JSON.stringify(sch, null, 4));
                return sch;
            }
        };
        return schemaOutput[type]();


    },
    readFile: function () {
        var model = this;
        //        if (this.get('file').name.endsWith(".json") || this.get('file').type === "application/json") {

        var reader = new FileReader();
        var data;
        reader.onload = function (e) {
            //parseJSON
            var text = e.target.result;
            data = model.getJSONschema(text);
            model.parseSchema(data);
        };
        reader.readAsText(this.get('file'));
        //        }
    },
    parseSchema: function (data) {
        this.set('data', data);

        var title = (data.properties || data.items) ? data.title || "Root" : null;
        var count = (title === null) ? 0 : this.traverseJSONSchema(data, title, 0, 0, this.get('parent').append("g").attr("class", "nested-group"), null);
        this.set('elementCount', count);
        this.updateContainerHeight();
        this.updateContainerWidth();
    },
    updateContainerHeight: function () {
        var outline = this.get('parent').select(".dmcontainer-outline");
        var model = this;
        var h = 0;
        outline.attr("height", function () {
            var count = model.get('elementCount'),
                height = model.nodeHeight;
            if (count < 5) {
                count = 5;
            }
            h = (count) * height;
            return h;
        });
        return h;
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
        var diff = maxLength - Number(parent.select(".dmcontainer-outline").attr("width"));
        parent.select(".dmcontainer-outline").attr("width", maxLength);
        parent.select(".dmcontainer-title-outline").attr("width", maxLength);
        //set the anchors
        if (this.get('type') === "input") {
            parent.selectAll(".drag-head").each(function () {
                var cx = maxLength,
                    cy = d3.select(this).attr("cy");
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
        Diagram.Connectors.findFromSourceContainer(parent).map(function (connector) {
            connector.setPoints(maxLength, connector.get('x2'), connector.get('y1'), connector.get('y2'));
        });
    },
    traverseJSONSchema: function (root, rootName, level, rank, resultPane, parentNode) {
        var height = this.nodeHeight,
            width = this.containerWidth,
            margin = this.rankMargin,
            x = 0,
            overhead = rank * margin,
            y = level * height,
            node = null;
        var tempParent = resultPane;
        if (root.type === "object") {
            if (rootName !== "") {
                var nodeText = rootName;
                node = new DataMapper.Models.Node({
                    parent: resultPane,
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
                new DataMapper.Views.NodeView({
                    model: node
                }).render();
                this.get('nodeCollection').add(node);
                rank++;
                level++;
            } else {
                node = parentNode;
            }
            tempParent = resultPane.append("g").attr("class", "nested-group");
            var keys = root.properties || {}; //select PROPERTIES
            for (var i = 0; i < Object.keys(keys).length; i++) { //traverse through each PROPERTY of the object
                var keyName = Object.keys(keys)[i];
                var key = keys[keyName];
                level = this.traverseJSONSchema(key, keyName, level, rank, tempParent, node);
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
                    textType: keys.type,
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
                new DataMapper.Views.NodeView({
                    model: node
                }).render();

                this.get('nodeCollection').add(node);
                rank++;
                level++;
            }
            if (keys.hasOwnProperty("properties")) {
                level = this.traverseJSONSchema(keys, "", level, rank, tempParent, node); //recurse through the items of array
            } else {
                tempParent = tempParent.append("g").attr("class", "nested-group");
            }

        } else { //if (DataMapper.Types.indexOf(root.type) > -1) {    //when the type is a primitive
            if (rootName !== "") {
                var nodeText = rootName;
                node = new DataMapper.Models.Node({
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
                new DataMapper.Views.NodeView({
                    model: node
                }).render();
                this.get('nodeCollection').add(node);
                rank++;
                level++;
                tempParent = tempParent.append("g").attr("class", "nested-group");
            }
        }
        if (root.attributes) {

            var keys = root.attributes;
            for (var i = 0; i < Object.keys(keys).length; i++) { //traverse through each PROPERTY of the object
                var keyName = Object.keys(keys)[i];
                var key = keys[keyName];
                y = level * height;
                overhead = rank * margin;
                node = new DataMapper.Models.Node({
                    parent: tempParent,
                    parentNode: node,
                    parentContainer: this,
                    text: keyName,
                    textType: key.type,
                    x: x,
                    y: y,
                    type: this.get('type'),
                    category: "attribute",
                    isLeaf: true,
                    height: height,
                    width: width,
                    isSchema: true,
                    overhead: overhead
                });
                new DataMapper.Views.NodeView({
                    model: node
                }).render();
                this.get('nodeCollection').add(node);

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
    createSchema: function (title) {
        var newSchema = {
            "title": title,
            "type": "object",
            "properties": {}
        };

        this.set('file', null);
        this.parseSchema(newSchema);
    },






    addNode: function (trigNode, newTitle, newType, isChild, isAttribute) {
        newType = newType.toLowerCase();
        var category = isAttribute ? "attribute" : "leaf",
            isLeaf = true,
            textType = newType;
        if (newType === "object" || newType === "array") {
            category = newType;
            isLeaf = false;
            if (newType === "array") {
                textType = "object";
            }
        }
        var self = this;
        var parentKey = isChild ? trigNode.get('text') : trigNode.get('parentNode').get('text');
        var trigKey = trigNode.get('text');
        var valueTemplate = (function getTemplate(type) {
            var defaultVal = {
                "type": type
            };
            switch (type) {
            case "object":
                defaultVal["properties"] = {};
                break;
            case "array":
                defaultVal["items"] = {
                    "type": "object",
                    "properties": {}
                };
                break;
            }
            return defaultVal;
        })(newType);

        //add the new node to the parent in schema
        function addSibling(data, currentVal, newAt, newVal) {
            var sch = data;
            if (isChild) {
                sch[newAt] = newVal;
            } else {
                var newObj = {};
                Object.keys(data).some(function (k) { //to maintain the order of the child nodes
                    newObj[k] = data[k];
                    if (k === currentVal) {
                        newObj[newAt] = newVal;
                    }
                });
                sch = newObj;
            }
            return sch;
        }

        var iterate = (function iter(o, search) { //iterate the data to find the parent node
            return Object.keys(o).some(function (k) {

                if ((k === search || o.title === search) && o[k]) {
                    var p;
                    if (o.title) {
                        p = o;
                    } else {
                        p = o[k];
                    }
                    var tempData = {};
                    if (isAttribute) {
                        if (!p["attributes"]) {
                            p["attributes"] = {};
                        }
                        tempData = p["attributes"];
                    } else {
                        tempData = p["properties"] || p["items"]["properties"];
                    }
                    var newData = addSibling(tempData, trigKey, newTitle, valueTemplate);

                    if (isAttribute) {
                        p.attributes = newData;
                    } else {
                        if (p.properties) {
                            p.properties = newData;
                        } else if (p.items.properties) {
                            p.items.properties = newData;
                        }
                    }
                    return true;
                }
                if (o[k] !== null && typeof o[k] === 'object') {
                    return iter(o[k], search);
                }
            });
        })(this.get('data'), parentKey);

        //find the last node when a sibling is added
        function findLastNodeSib(node) {
            if (node.nextSibling && d3.select(node.nextSibling).classed("nested-group")) {
                var last = node.nextSibling.lastChild;
                if (last) {
                    if (d3.select(last).classed("nested-group")) { // last is a parent
                        return findLastNodeSib(last.previousSibling);
                    } else { //last is leaf node
                        return last;
                    }
                } else { //empty
                    return node;
                }
            } else {
                return node;
            }
        }
        //find the last node when a child is added
        function findLastNodeChild(node) {
            var last = node.lastChild;
            if (last) {
                if (d3.select(last).classed("nested-group")) {
                    return findLastNodeChild(last);
                } else {
                    return last;
                }
            } else {
                if (d3.select(node).classed("nested-group")) {
                    return node.previousSibling;
                }
                return node;
            }
        }
        var nextSibling, y, parent, parentNode, overhead;
        var rep = isChild ? findLastNodeChild(trigNode.get('node').node().nextSibling) : findLastNodeSib(trigNode.get('node').node());
        var repd = d3.select(rep);
        y = Number(repd.attr('y')) + Number(repd.attr('height'));

        if (isChild) {

            parent = d3.select(trigNode.get('node').node().nextSibling);
            parentNode = trigNode;
            overhead = Number(trigNode.get('overhead')) + self.rankMargin;
        } else {

            parent = d3.select(trigNode.get('node').node().parentElement);
            parentNode = trigNode.get('parentNode');
            overhead = trigNode.get('overhead');
        }
        self.get('nodeCollection').pushNodes(y, Number(trigNode.get('height')));
        var node = new DataMapper.Models.Node({
            parent: parent,
            parentNode: parentNode,
            parentContainer: self,
            text: newTitle,
            textType: textType,
            x: trigNode.get('x'),
            y: y,
            type: trigNode.get('type'),
            category: category,
            isLeaf: isLeaf,
            height: trigNode.get('height'),
            width: trigNode.get('width'),
            isSchema: true,
            overhead: overhead,
        });
        var newNode = new DataMapper.Views.NodeView({
            model: node
        }).render();
        var newNestNode;
        if (newType === "object" || newType === "array") {
            newNestNode = parent.append("g").attr("class", "nested-group");
        }

        //reorder the DOM elements
        if (!isChild) {
            var t1 = $(newNode.node()).detach(),
                t2;
            if (newNestNode) {
                t2 = $(newNestNode.node()).detach();
            }
            var flag = false;
            var counterNode = trigNode.get('node').node();
            if (d3.select(counterNode.nextSibling).classed("nested-group")) {
                counterNode = counterNode.nextSibling;
            }
            Array.from(parent.node().children).map(function (tchild) {
                if (flag) {
                    var t3 = $(tchild).detach();
                    t3.appendTo($(parent.node()));
                }
                if (tchild.isSameNode(counterNode)) {
                    t1.appendTo($(parent.node()));
                    if (t2) {
                        t2.appendTo($(parent.node()));
                    }
                    flag = true;
                }
            });
        }

        self.get('nodeCollection').add(node);
        self.set('elementCount', self.get('elementCount') + 1);
        this.updateContainerHeight();
        this.updateContainerWidth();

    },
    editNode: function (trigNode, newTitle, newType) {
        var iterate = (function iter(o, search) {
            return Object.keys(o).some(function (k) {

                if (o[k]) {
                    if (k === search) {

                        var temp = o[k];
                        temp["type"] = newType;
                        o[newTitle] = temp;
                        delete o[k];
                        return true;
                    }
                    if (o.title === search) {
                        o.title = newTitle;
                        o.type = newType;
                        return true;
                    }

                }
                if (o[k] !== null && typeof o[k] === 'object') {
                    return iter(o[k], search);
                }
            });
        })(this.get('data'), trigNode.get('text'));

        trigNode.set('text', newTitle);
        trigNode.set('textType', newType);
        trigNode.updateText();
        trigNode.updateIcon();
        trigNode.updateLeaf();
    },
    deleteNode: function (trigNode) {
        if (trigNode.get('text') === this.get('data').title) {
            //clearcontainer
        }
        //delete from the schema
        var iterate = (function iter(o, search) {
            return Object.keys(o).some(function (k) {

                if (o[k]) {
                    if (k === search) {
                        delete o[k];
                        return true;
                    }
                }
                if (o[k] !== null && typeof o[k] === 'object') {
                    return iter(o[k], search);
                }
            });
        })(this.get('data'), trigNode.get('text'));

        //delete from UI
        this.get('nodeCollection').remove(trigNode);
        this.get('nodeCollection').pushNodes(trigNode.get('y'), -Number(trigNode.get('height')));
        trigNode.deleteNode();
    }
});
DataMapper.Collections.TreeContainers = Backbone.Collection.extend({
    model: DataMapper.Models.TreeContainer,
    url: "/treecontainers",
    getContainerByID: function (id) {
        return this.find(function (item) {
            return item.get('parent').attr("id") === id;
        });
    },
    getOutContainers: function () {

    },
    getInContainers: function () {

    }
});
//BUG = LOADfILE ONCE, AGAIN LOAD FILE AGAIN AND CANCEL - TYPERROR - CAUSE "Onchange" listener