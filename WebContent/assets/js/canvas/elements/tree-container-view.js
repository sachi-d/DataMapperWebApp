/**
 * Created by sachithra on 10/24/16.
 */
DataMapper.Views.OperatorView = Backbone.View.extend({
    el: "#op-panel",
    initialize: function () {
        this.el = "#" + this.id;
    },
    render: function () {
        this.model.drawContainer();
        this.bindMenu();
    },
    bindMenu: function () {
        var self = this;
        var id = this.el;
        var classClicked = id + "-clicked";
        $(id + " .dmcontainer-title-outline").on("contextmenu", function (event) {
            // Avoid the real one
            event.preventDefault();

            // Show contextmenu
            $("#operator-menu").finish().toggle(100)
                .css({ // In the right position (the mouse)
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                })
                .addClass(classClicked);
        });
        // If the document is clicked somewhere
        $(document).on("mousedown", function (e) {

            // If the clicked element is not the menu
            if (!$(e.target).parents(".custom-menu").length > 0) {

                // Hide it
                $("#operator-menu").removeClass(classClicked);
                $(".custom-menu").hide(100);
            }
        });


// If the menu element is clicked
        $("#operator-menu li").on("click", function () {
            // This is the triggered action name
            if ($("#operator-menu").hasClass(classClicked)) {
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

    },
    clearContainer: function () {
        this.model.get('parent').remove();
        Diagram.Operators.remove(this.model);
        console.log(Diagram.Operators);
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
    },
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
            .attr("id", this.id + "-title-outline")
            .attr("cursor", "move");

        var title = parent.append("text")
            .classed("dmcontainer-title", true)
            .attr("x", 0).attr("y", -5)
            .attr("font-weight", "bold")
            .text(this.text)
            .attr("cursor", "move");

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
            .on("change", function () {
                self.fileChange();
            });
        this.schemaSelect = input;
        return parent;
    }
    ,
    bindMenu: function () {
        var self = this;
        var id = this.el;
        var classClicked = id + "-clicked";
        $(id + " .dmcontainer-title-outline").on("contextmenu", function (event) {
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
    fileChange: function () {
        this.clearContainer();
        var e = d3.event;
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