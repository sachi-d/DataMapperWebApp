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
    el: "#canvas",
    id: "id",
    color: "red",
    text: "cont",
    model: null,
    initialize: function (options) {
        this.text = options.text;
        this.color = options.color;
        var el = this.drawInitContainer();
        this.el = "#" + this.id;
        el.call(this.model.dragContainer());
        this.model.set('parent', el);

        this.bindMenu();
        //this.model.onchange updateContainer
    }
    ,
    render: function () {
        this.model.drawContainer();
    }
    // ,
    // events: {
    //     "change .schema-select": "fileChange",
    // }
    ,
    drawInitContainer: function () {
        var self = this;
        var parent = d3.select("#canvas").append("g")
            .attr("id", this.id)
            .attr("class", "tree-dmcontainer dmcontainer")
            .attr("transform", "translate(" + this.model.get('x') + "," + this.model.get('y') + ")");

        var height = this.model.get("nodeHeight") || this.model.nodeHeight;
        var width = this.model.get("containerWidth") || this.model.containerWidth;

        var titleOutline = parent.append("rect")
            .classed("dmcontainer-title-outline", true)
            .attr("x", 0).attr("y", -height)
            .attr("height", height)
            .attr("width", width)
            .attr("fill", this.color)
            .attr("stroke", "#000")
            .attr("id", this.id + "-title-outline");

        var title = parent.append("text")
            .classed("dmcontainer-title", true)
            .attr("x", 0).attr("y", -5)
            .attr("font-weight", "bold")
            .text(this.text);

        var containerOutline = parent.append("rect")
            .classed("dmcontainer-outline", true)
            .attr("x", 0).attr("y", 0)
            .attr("height", height * 10)
            .attr("width", width)
            .attr("fill", "none")
            .attr("stroke", "#000");
        var fo = parent.append("foreignObject").attr("x", 0).attr("y", 0).attr("height", 100).attr("width", 100);
        var input = fo.append("xhtml:input")
            .attr("type", "file")
            .classed("schema-select", true)
            .attr("name", "input-select[]")
            .attr("id", this.id + "-schema-select")
            .attr("accept", "application/json")
            .style("display", "none")
            .on("change", function(){
               self.fileChange();
            });
        this.schemaSelect = input;
        return parent;
    }
    ,
    bindMenu: function () {
        var self = this;
        var id = d3.select(this.el).select(".dmcontainer-title-outline").attr("id");
        var classClicked = id + "-clicked";
        $("#" + id).on("contextmenu", function (event) {
            console.log(self.id);
            // Avoid the real one
            event.preventDefault();

            // Show contextmenu
            $("#dmcontainer-menu").finish().toggle(100).// In the right position (the mouse)
            css({
                top: event.pageY + "px",
                left: event.pageX + "px"
            }).addClass(classClicked);
        });
        // If the document is clicked somewhere
        $(document).on("mousedown", function (e) {

            // If the clicked element is not the menu
            if (!$(e.target).parents(".custom-menu").length > 0) {

                // Hide it
                $("#dmcontainer-menu").removeClass(classClicked);
                $(".custom-menu").hide(100);
            }
        });


// If the menu element is clicked
        $("#dmcontainer-menu li").on("click", function () {
            // This is the triggered action name
            if ($("#dmcontainer-menu").hasClass(classClicked)) {
                switch ($(this).attr("data-action")) {

                    // A case for each action. Your actions here
                    case "load":
                        $("#" + self.schemaSelect.attr("id")).trigger("click");
                        break;
                    case "clear":
                        self.clearContainer();
                        break;
                }
            }

            // Hide it AFTER the action was triggered
            $(".custom-menu").hide(100);
        });

    }
    ,
    triggerInput: function () {

    }
    ,
    fileChange: function () {
        var e=d3.event;
        e.stopPropagation();
        e.preventDefault();
         // e.dataTransfer = e.originalTarget.dataTransfer;
        var files = e.target.files || e.dataTransfer.files;
        this.model.set('file', files[0]);
        this.render();
    }
    ,
    clearContainer: function () {
        this.model.get('parent').selectAll(".nested-group").remove();
        this.model.set('nodeCollection', new DataMapper.Collections.NodeList());
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
    inputStartX: 40,
    inputStartY: 40,
    outputStartX: 1000,
    outputStartY: 40,
    initialize: function () {
        // new DataMapper.Views.LoadFileView();
        // new DataMapper.Views.OperatorPanelView();
        DataMapper.Connectors = new DataMapper.Collections.Connectors();
        DataMapper.VariableList = new DataMapper.Collections.NodeList();
        DataMapper.Operators = new DataMapper.Collections.Operators();
        var inputModel = new DataMapper.Models.TreeContainer({
            type: "input",
            x: this.inputStartX,
            y: this.inputStartY
        });
        DataMapper.InputView = new DataMapper.Views.TreeContainerView({
            id: "input-dmcontainer",
            model: inputModel,
            text: "Input",
            color: "#D3DA7B"
        });
        var outputModel = new DataMapper.Models.TreeContainer({
            type: "output",
            x: this.outputStartX,
            y: this.outputStartY
        });
        DataMapper.OutputView = new DataMapper.Views.TreeContainerView({
            id: "output-dmcontainer",
            model: outputModel,
            text: "Output",
            color: "#FCE0D3"
        });
        //                    this.render();
    }
});