/**
 * Created by sachithra on 10/24/16.
 */
DataMapper.Views.OperatorView = Backbone.View.extend({
    el: "#op-panel",
    initialize: function () {
        this.el = "#" + this.id;
    },
    render: function () {
        this.model.drawOperatorContainer();
        this.bindMenu("#operator-menu");
    },
    bindMenu: function (menu) {
        console.log(this.el);
        var self = this;
        var id = this.el;
        var classClicked = id + "-clicked";
        $(id + " .dmcontainer-structure").on("contextmenu", function (event) {
            console.log("avoid");
            // Avoid the real one
            event.preventDefault();

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
                    case "load-schema":
                        $("#" + self.schemaSelect.attr("id")).trigger("click");
                        break;
                    case "clear-container":
                        self.clearContainer();
                        break;
                }
            }

            // Hide it AFTER the action was triggered
            $(menu).hide(100);
        });

    },
    clearContainer: function () {
        Diagram.Connectors.findFromTargetContainer(this.model.get('parent')).map(function (connector) {
            connector.removeConnector();
        });

        this.model.get('parent').remove();
        Diagram.Operators.remove(this.model);
    }
});

DataMapper.Views.TreeContainerView = DataMapper.Views.OperatorView.extend({
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
        this.bindMenu("#dmcontainer-menu");
    }
    ,
    render: function () {
        this.model.drawContainer();
    },
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
            .text(this.text)
            .attr("cursor", "move");

        var containerOutline = parent.append("rect")
            .classed("dmcontainer-outline", true)
            .classed("dmcontainer-structure", true)
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
        Diagram.Connectors.clearConnectionsFromContainer(this.model.get('parent'));
        this.model.get('parent').selectAll(".nested-group").remove();
        this.model.set('nodeCollection', new DataMapper.Collections.NodeList());
    }
})
;