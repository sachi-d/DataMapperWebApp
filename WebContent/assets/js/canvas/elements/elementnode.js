/**
 * Created by sachithra on 10/19/16.
 */

DataMapper.Views.NodeView = Backbone.View.extend({
    el: ".node-element",
    menu: "#container-node-menu",
    initialize: function () {

    },
    render: function () {
        var obj = this.model.drawNode();
        this.el = "#" + obj.attr("id");
        if (this.model.get('isSchema')) {
            this.bindMenu(this.menu);
        }
        return obj;
    },
    bindMenu: function (menu) {
        var self = this;
        var id = this.el;
        var classClicked = id + "-clicked";
        $(id + " .tree-node-element-text").on("contextmenu", function (event) {

            // Avoid the real one
            event.preventDefault();

            //hide add options for attributes
            if ($(this).hasClass("attribute-text")) {
                $('[data-action="add-node"]').hide();
                $('[data-action="add-attribute"]').hide();
            } else {
                $('[data-action="add-node"]').show();
                $('[data-action="add-attribute"]').show();
            }

            // Show contextmenu
            $(menu).finish().toggle(100)
                .css({ // In the right position (the mouse)
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                })
                .addClass(classClicked);
        });
        // If the document is clicked somewhere
        $(document).on("mousedown", function (e) {

            // If the clicked element is not the menu
            if (!$(e.target).parents(menu).length > 0) {

                // Hide it
                $(menu).removeClass(classClicked);
                $(menu).hide(100);
            }
        });


        // If the menu element is clicked
        $(menu + " li").on("click", function () {
            // This is the triggered action name
            if ($(menu).hasClass(classClicked)) {
                switch ($(this).attr("data-action")) {

                    // A case for each action. Your actions here
                case "add-node":
                    self.addNode();
                    break;
                case "edit-node":
                    self.editNode();
                    break;
                case "clear-node":
                    self.clearNode();
                    break;
                case "add-attribute":
                    self.addAttribute();
                    break;
                }
            }

            // Hide it AFTER the action was triggered
            $(menu).hide(100);
        });

    },
    addNode: function (type) {

        var self = this;

        var isLeaf = this.model.get('isLeaf') ? ' style="display:none" ' : '',
            childOnly = this.model.get('parentNode') === null ? ' checked readonly ' : '';
        BootstrapDialog.show({
            title: "Add new node",
            message: 'Title: <input id="title" type="text"><br>Type:<select id="type">' + this.getTypeOptionList("Object", "null") + '</select><div ' + isLeaf + ' ><br>Add as child: <input type="checkbox" id="isChild" ' + childOnly + '></div> ',
            draggable: true,
            buttons: [{
                    label: 'Add',
                    cssClass: "btn-primary",
                    action: function (dialogRef) {
                        var modalBody = dialogRef.getModalBody();
                        self.model.get('parentContainer').addNode(self.model, modalBody.find('#title').val(), modalBody.find('#type').val(), modalBody.find('#isChild').is(":checked"), false);
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
    addAttribute: function () {
        var self = this;
        BootstrapDialog.show({
            title: "Add attribute",
            message: 'Title: <input id="title" type="text"><br>Type:<select id="type">' + this.getTypeOptionList("Object", "leaf") + '</select> ',
            draggable: true,
            buttons: [{
                    label: 'Add attribute',
                    cssClass: "btn-primary",
                    action: function (dialogRef) {
                        var modalBody = dialogRef.getModalBody();
                        self.model.get('parentContainer').addNode(self.model, modalBody.find('#title').val(), modalBody.find('#type').val(), true, true);
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
    editNode: function () {
        console.log(this.model.get('tree'));
        var self = this,
            disabled = this.model.get('parentNode') === null ? ' disabled ' : '',
            type = this.model.get('textType'),
            isParent = type === "object" || type === "array" ? "parent" : "leaf",
            optionParent = '<option value="' + type + '">' + type + '</option>',
            options = isParent === "parent" ? optionParent : self.getTypeOptionList(type, isParent);

        BootstrapDialog.show({
            title: "Edit node",
            message: 'Title: <input id="title" type="text" value="' + self.model.get('text') + '"><br>Type:<select id="type" ' + disabled + '>' + options + '</select>',
            draggable: true,
            buttons: [{
                    label: 'Edit',
                    cssClass: "btn-primary",
                    action: function (dialogRef) {
                        var modalBody = dialogRef.getModalBody();
                        self.model.get('parentContainer').editNode(self.model, modalBody.find('#title').val(), modalBody.find('#type').val());
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
    clearNode: function () {
        console.log(this.model.get('tree'));
        var self = this;
        BootstrapDialog.show({
            title: "Delete node?",
            message: 'Are you sure you want to delete the node? <br> Children nodes too will be deleted.',
            draggable: true,
            buttons: [{
                    label: "Delete node",
                    cssClass: "btn-danger",
                    action: function (dialogRef) {
                        self.model.get('parentContainer').deleteNode(self.model);
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
    getTypeOptionList: function (selectedType, constraint) { //constraint= "null" or "leaf" or "parent"
        var list = "";
        DataMapper.Types.map(function (type) {
            var value = type.toLowerCase();
            if (constraint === "leaf") {
                if (value === "object" || value === "array") {
                    return;
                }
            } else if (constraint === "parent") {
                if (value !== "object" && value !== "array") {
                    return;
                }
            }
            var isSelected = (selectedType.toLowerCase().split("[")[0]) === value ? "selected" : "";
            list += '<option value="' + value + '" ' + isSelected + '>' + type + '</option>';
        });
        return list;
    }
});

DataMapper.Models.Node = Backbone.Model.extend({ //set parent, text, x,y, type,category
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
        node: d3.select("#canvas"),
        objectIcon: "assets/images/object-icon.png",
        arrayIcon: "assets/images/array-icon.png",
        leafIcon: "assets/images/leaf-icon.png",
        attributeIcon: "assets/images/attribute-icon.png"
    },
    initialize: function () {
        this.set("id", "node-" + this.cid);
        this.calculateDotPosition();
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
            .attr("width", width)
            .attr("id", this.id);
        this.set('node', parent1);

        var back = parent1.append("rect")
            .classed("node-element-back", true)
            .attr("x", this.get('x'))
            .attr("y", this.get('y'))
            .attr("width", this.get('width'))
            .attr("height", this.get('height'))
            .attr("fill", "white");
        var text = parent1.append("text")
            .attr("x", Number(this.get('x')) + 12)
            .attr("y", Number(this.get('y')) + (3 * height / 4))
            .text(function () {
                var subType = model.get('category') === "array" ? "array[" + model.get('textType') + "]" : model.get('textType');
                return model.get('text') + ":" + subType;
            })
            .attr("class", "node-element-text");
        if (model.get('category') === "attribute") {
            text.classed("attribute-text", true);
        }

        if (this.get('category') === "operator") {
            back.attr("stroke", "black");
            text.attr("fill", "#989898");
        }
        parent1.attr("type", this.get('type'));


        if (this.get('isSchema')) {
            parent1.select("text").attr("x", this.get("x") + 12 + this.get('overhead')).classed("tree-node-element-text", true);

            parent1.append("svg:image")
                .attr("x", Number(this.get('x')) + Number(this.get('overhead')))
                .attr("y", Number(this.get('y')) + 4)
                .attr("width", 11)
                .attr("height", 11);
            model.updateIcon();
        }
        model.updateLeaf();
        return parent1;
    },

    calculateDotPosition: function () {
        if (this.get('isLeaf')) {
            if (this.get('type') === "input") {
                this.set('dotPosition', [Number(this.get('x')) + Number(this.get('width')), Number(this.get('y')) + this.get('height') / 2]);
            } else if (this.get('type') === "output") {
                this.set('dotPosition', [Number(this.get('x')), Number(this.get('y')) + this.get('height') / 2]);
            }
        }
    },
    updateLeaf: function () {
        if (this.get('textType') !== "object" && this.get('textType') !== "array") {
            if (!this.get('node').classed('leaf-node')) {
                this.set('isLeaf', true);
                this.get('node').classed("leaf-node", true);
                if (this.get('dotPosition').length !== 2) {
                    this.calculateDotPosition();
                }

                var anchor = new DataMapper.Models.Anchor({
                    parent: this.get('node'),
                    cx: this.get('dotPosition')[0],
                    cy: this.get('dotPosition')[1],
                    type: this.get('type')
                });
                new DataMapper.Views.AnchorView({
                    model: anchor
                });
            }
        }
    },
    updateText: function () {
        this.get('node').select("text").text(this.get('text') + ":" + this.get('textType'));
    },
    updateIcon: function () {
        var type = this.get('category').toLowerCase();
        var self = this;
        this.get('node').select("image").attr("xlink:href", function () {
            if (type === "object") {
                return self.get('objectIcon');
            } else if (type === "array") {
                return self.get('arrayIcon');
            } else if (type === "attribute") {
                return self.get('attributeIcon');
            }
            return self.get('leafIcon');
        });
    },
    updatePosition: function (newX, newY) {
        //update x and y
        this.set('x', newX);
        this.set('y', newY);
        var node = this.get('node');
        var diffX = newX - Number(node.attr("x"));
        var diffY = newY - Number(node.attr("y"));
        if (diffX || diffY) {
            node.attr("x", newX).attr("y", newY);
            var childList = node.node().children;

            Array.from(childList).map(function (child) {
                var d3child = d3.select(child);
                if (d3child.attr("cx")) {
                    d3child.attr("cx", function () {
                        return Number(d3child.attr("cx")) + diffX;
                    });
                    d3child.attr("cy", function () {
                        return Number(d3child.attr("cy")) + diffY;
                    });
                }
                if (d3child.attr("x")) {
                    d3child.attr("x", function () {
                        return Number(d3child.attr("x")) + diffX;
                    });
                    d3child.attr("y", function () {
                        return Number(d3child.attr("y")) + diffY;
                    });
                }

            });
            Diagram.Connectors.findFromSourceContainer(this.get('parentContainer').get('parent')).map(function (connector) {
                if (connector.get('sourceNode').get('node').node().isSameNode(node.node())) {
                    connector.set("x1", Number(connector.get("x1")) + Number(diffX));
                    connector.set("y1", Number(connector.get("y1")) + Number(diffY));
                    connector.setPoints(connector.get('x1'), connector.get('x2'), connector.get('y1'), connector.get('y2'));
                }
            });
            Diagram.Connectors.findFromTargetContainer(this.get('parentContainer').get('parent')).map(function (connector) {
                if (connector.get('targetNode').get('node').node().isSameNode(node.node())) {
                    connector.set("x2", Number(connector.get("x2")) + Number(diffX));
                    connector.set("y2", Number(connector.get("y2")) + Number(diffY));
                    connector.setPoints(connector.get('x1'), connector.get('x2'), connector.get('y1'), connector.get('y2'));
                }
            });
        }
    },
    deleteNode: function () {
        Diagram.Connectors.findFromSourceNode(this.get('node')).map(function (connector) {
            connector.removeConnector();
        });
        var temp = Diagram.Connectors.findFromTargetNode(this.get('node'));
        if (temp) {
            temp.removeConnector();
        }
        this.get('parentContainer').get('nodeCollection').remove(this);
        this.get('node').remove();
    }
});


DataMapper.Collections.NodeList = Backbone.Collection.extend({
    model: DataMapper.Models.Node,
    url: "/nodelist",
    getNodeFromDOMObject: function (object) {
        return this.find(function (node) {
            return node.get("node").node().isSameNode(object);
        });
    },
    pushNodes: function (newY, depth) {
        this.find(function (node) {
            var currY = Number(node.get('y'));
            if (currY >= newY) {
                node.updatePosition(0, currY + depth * node.get('height'));
                var newLevel = Number(node.get('tree').get('level')) + depth;
                node.get('tree').set('level', newLevel);
            }
        });
    }
});