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
        $(id + " .node-element-text").on("contextmenu", function (event) {

            // Avoid the real one
            event.preventDefault();

            // Show contextmenu
            $(menu).finish().toggle(100)
                .css({// In the right position (the mouse)
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
                }
            }

            // Hide it AFTER the action was triggered
            $(menu).hide(100);
        });

    },
    addNode: function () {
//        $("#add-root-element-modal").show();
//        BootstrapDialog.show({
//            title: 'Draggable Dialog',
//            message: 'Try to drag on dialog title to move your dialog.',
//            draggable: true
//        });
//        var $msgBody = $('<form class="form-horizontal"></form>');
//        var $titleBody = $('<div class="form-group"><label class="control-label col-sm-2" >Title:</label><div class="col-sm-10"><input type="text" class="form-control" id="title" ></div></div>');
//        var $typeBody = $('<div class="form-group"></div>');
//        $msgBody.append($titleBody).append($typeBody);
//
//        var $typeDiv = $('<div class="col-sm-10"></div>');
//        var $select = $('<select id="type"   class="form-control" style="display:inline"></select>');
//        $typeDiv.append($select);
//        $typeBody.append($('<label class="control-label col-sm-2" >Type:</label>')).append($typeDiv);
//
//        $select.append("<option>Optijn 1n</option>");
//        $select.append("<option>Option2222</option>");

        var self = this;

        var isLeaf = this.model.get('isLeaf') ? ' style="display:none" ' : '';
        BootstrapDialog.show({
            title: "Add new node",
            message: 'Title: <input id="title" type="text"><br>Type:<select id="type">' + this.getTypeOptionList("Object") + '</select><div ' + isLeaf + ' ><br>Add as child: <input type="checkbox" id="isChild"></div> ',
            draggable: true,
            onhidde: function (dialogRef) {
                var fruit = dialogRef.getModalBody().find('#title').val();
                if ($.trim(fruit.toLowerCase()) !== 'banana') {
                    alert('Need banana!');
                    return false;
                }
            },
            buttons: [{
                label: 'Add',
                cssClass: "btn-primary",
                action: function (dialogRef) {
                    var modalBody=dialogRef.getModalBody();
                    self.model.get('parentContainer').addNode(self.model, modalBody.find('#title').val(), modalBody.find('#type').val(),modalBody.find('#isChild').is(":checked"));
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
        var self = this;
        BootstrapDialog.show({
            title: "Edit node",
            message: 'Title: <input id="title" type="text" value="' + self.model.get('text') + '"><br>Type:<select id="type">' + self.getTypeOptionList(this.model.get('textType')) + '</select>',
            draggable: true,
            onhidde: function (dialogRef) {
                var fruit = dialogRef.getModalBody().find('#title').val();
                if ($.trim(fruit.toLowerCase()) !== 'banana') {
                    alert('Need banana!');
                    return false;
                }
            },
            buttons: [{
                label: 'Edit',
                cssClass: "btn-primary",
                action: function (dialogRef) {
                    console.log(self.model.get('text'));
                    console.log(self.model.get('textType'));
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

    },
    getTypeOptionList: function (selectedType) {
        var list = "";
        DataMapper.Types.map(function (type) {
            var value = type.toLowerCase();
            var isSelected = (selectedType.toLowerCase().split("[")[0]) === value ? "selected" : "";
            list += '<option value="' + value + '" ' + isSelected + '>' + type + '</option>';
        });
        return list;
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
        this.set("id", "node-" + this.cid);
        if (this.get('isLeaf')) {
            if (this.get('type') === "input") {
                this.set('dotPosition', [this.get('x') + this.get('width'), this.get('y') + this.get('height') / 2]);
            } else if (this.get('type') === "output") {
                this.set('dotPosition', [this.get('x'), this.get('y') + this.get('height') / 2]);
            }
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
            .attr("width", width)
            .attr("id", this.id);
        this.set('node', parent1);

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
        if (this.get('isSchema')) {
            parent1.select("text").attr("x", this.get("x") + 12 + this.get('overhead'));
            var model = this;
            parent1.append("svg:image")
                .attr("x", this.get('x') + this.get('overhead'))
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

        }

        return parent1;
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


DataMapper.Collections.NodeList = Backbone.Collection.extend({
    model: DataMapper.Models.Node,
    url: "/nodelist",
    getNodeFromDOMObject: function (object) {
        return this.find(function (node) {
            return node.get("node").node().isSameNode(object);
        });
    }
});
