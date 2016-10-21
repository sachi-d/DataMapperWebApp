/**
 * Created by sachithra on 10/19/16.
 */
DataMapper.Views.LoadFileView = Backbone.View.extend({
    el: "#file-load",
    events: {
        "click .file-select": "fileChange",
        "dragenter .file-drag": "dragEnter",
        "dragleave .file-drag": "dragLeave",
        "dragover .file-drag": "dragOver",
        "drop .file-drag": "drop",
        "click #load-input-btn": 'slideInput',
        "click #load-output-btn": "slideOutput",
        "click #clear-input-btn": "clearInput",
        "click #clear-output-btn": "clearOutput"
    },
    slideInput: function () {
        $("#load-input").slideToggle();
    },
    slideOutput: function () {
        $("#load-output").slideToggle();
    },
    clearInput: function () {
        d3.select("#input-container").selectAll(".nested-group").remove();
        DataMapper.InputView.model.set('nodeCollection', new DataMapper.Collections.NodeList());
    },
    clearOutput: function () {
        d3.select("#output-container").selectAll(".nested-group").remove();
        DataMapper.OutputView.model.set('nodeCollection', new DataMapper.Collections.NodeList());
    },
    drop: function (e) {
        this.dragLeave(e);
        this.fileChange(e);
    },

    dragEnter: function (e) {
        d3.select(e.target).classed("file-drag-hover", true);
    },
    dragLeave: function (e) {
        d3.select(e.target).classed("file-drag-hover", false);
    },
    dragOver: function (e) {
        e.stopPropagation();
        e.preventDefault();
        d3.select(e.target).classed("file-drag-hover", true);
    }
});
DataMapper.Views.AnchorView = Backbone.View.extend({
    el: ".drag-head",
    initialize: function () {
        this.model.drawArrow();
    }
});
DataMapper.Views.NodeView = Backbone.View.extend({
    el: ".node-element",
    initialize: function () {
        this.model.drawNode();
    }
});
DataMapper.Views.OperatorView = Backbone.View.extend({
    el: "#op-panel",
    initialize: function () {
        this.render();
    },
    render: function () {
        this.model.drawContainer();
    }
});
DataMapper.Views.TreeContainerView = Backbone.View.extend({
    initialize: function () {

        d3.select(this.el).call(this.model.dragContainer());
        this.model.set('parent', d3.select(this.el));
        this.drawInitContainer();

        this.bindMenu();

        //this.model.onchange updateContainer
    }
    ,
    render: function () {
        this.model.drawContainer();
    }
    ,
    events: {
        "click .file-select": "fileChange",
    }
    ,
    drawInitContainer: function () {
        var parent = d3.select(this.el);
        var height = this.model.get("nodeHeight") || this.model.nodeHeight;
        var width = this.model.get("containerWidth") || this.model.containerWidth;
        parent.select(".dmcontainer-title-outline").attr("x", 0).attr("y", -height).attr("height", height).attr("width", width);
        parent.select(".dmcontainer-title").attr("x", 0).attr("y", -5);
        parent.select(".dmcontainer-outline").attr("x", 0).attr("y", 0).attr("height", height).attr("width", width);
        this.model.updateContainerHeight();
    }
    ,
    bindMenu: function () {
        var self = this;
        var id = d3.select(this.el).select(".dmcontainer-title-outline").attr("id");
        console.log("init con");
        $("#" + id).bind("contextmenu", function (event) {

            // Avoid the real one
            event.preventDefault();

            // Show contextmenu
            $("#dmcontainer-menu").finish().toggle(100).// In the right position (the mouse)
            css({
                top: event.pageY + "px",
                left: event.pageX + "px"
            });
        });
        // If the document is clicked somewhere
        $(document).bind("mousedown", function (e) {

            // If the clicked element is not the menu
            if (!$(e.target).parents(".custom-menu").length > 0) {

                // Hide it
                $(".custom-menu").hide(100);
            }
        });


// If the menu element is clicked
        $("#dmcontainer-menu li").click(function () {
            // This is the triggered action name
            switch ($(this).attr("data-action")) {

                // A case for each action. Your actions here
                case "load":
                    $(".file-select").trigger("click");
                    break;
                case "clear":
                    alert("second");
                    break;
            }

            // Hide it AFTER the action was triggered
            $(".custom-menu").hide(100);
        });

    }
    ,
    fileChange: function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer = e.originalEvent.dataTransfer;
        var files = e.target.files || e.dataTransfer.files;
        this.get('model').set('file', files[0]);
        this.render();
    },
    clearContainer: function () {
        this.get('model').get('parent').selectAll(".nested-group").remove();
        this.get('model').set('nodeCollection', new DataMapper.Collections.NodeList());
    }
})
;
DataMapper.Views.OperatorPanelView = Backbone.View.extend({
    el: "#op-panel",
    events: {
        "click #concat-op-btn": "addConcatOp",
        "click #split-op-btn": "addSplitOp"
    },
    addConcatOp: function () {
        var concatModel = new DataMapper.Models.Operator({
            title: "Concat",
            id: "concat" + DataMapper.Operators.length,
            inputCount: 2,
            outputCount: 1,
            inputType: "String",
            outputType: "String"
        });
        var concatView = new DataMapper.Views.OperatorView({model: concatModel});
        DataMapper.Operators.add(concatModel);
    },
    addSplitOp: function () {
        var splitModel = new DataMapper.Models.Operator({
            title: "Split",
            id: "split" + DataMapper.Operators.length,
            inputCount: 1,
            outputCount: 3,
            inputType: "String",
            outputType: "String"
        });
        var splitView = new DataMapper.Views.OperatorView({model: splitModel});
        DataMapper.Operators.add(splitModel);
    }
});
DataMapper.Views.CanvasView = Backbone.View.extend({
    el: "#canvas",
    params: {
        inputStartX: 40,
        inputStartY: 40,
        outputStartX: 800,
        outputStartY: 40
    },
    initialize: function () {
        new DataMapper.Views.LoadFileView();
        new DataMapper.Views.OperatorPanelView();
        DataMapper.Connectors = new DataMapper.Collections.Connectors();
        DataMapper.VariableList = new DataMapper.Collections.NodeList();
        DataMapper.Operators = new DataMapper.Collections.Operators();
        var inputModel = new DataMapper.Models.TreeContainer({type: "input", x: 40});
        DataMapper.InputView = new DataMapper.Views.TreeContainerView({el: "#input-dmcontainer", model: inputModel});
        var outputModel = new DataMapper.Models.TreeContainer({type: "output", x: 1300});
        DataMapper.OutputView = new DataMapper.Views.TreeContainerView({
            el: "#output-dmcontainer",
            model: outputModel
        });
        //                    this.render();
    }
});