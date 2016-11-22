/**
 * Created by sachithra on 10/24/16.
 */
DataMapper.Views.ContainerView = Backbone.View.extend({
    el: "#canvas",
    menu: "#menu",
    initialize: function () {

    },
    render: function () {
        var el = this.drawInitContainer();
        this.el = "#" + this.id;
        this.model.set('parent', el);
        this.bindMenu(this.menu);
        d3.select(this.el).call(this.dragContainer());
    },
    dragContainer: function () {
        var self = this;
        var selfModel = this.model;
        return d3.drag()
            .on("start", function () {})
            .on("drag", function (d, i) {
                this.x = this.x || selfModel.get('x');
                this.y = this.y || selfModel.get('y');
                this.x += d3.event.dx;
                this.y += d3.event.dy;
                d3.select(this).attr("transform", "translate(" + [this.x, this.y] + ")");
                self.updateConnections(d3.event.dx, d3.event.dy);
                //   self.resizeCanvas(this.x, this.y);
            })
            .on("end", function () {
                // resizeCanvas();
            });
    },
    bindMenu: function (menu) {
        var self = this;
        var id = this.el;
        var classClicked = id + "-clicked";
        $(id + " .dmcontainer-structure").on("contextmenu", function (event) {
            // console.log(menu);
            // Avoid the real one
            event.preventDefault();

            //restrict adding root element to non-empty containers
            if (self.model.get('elementCount') !== 0) {
                $('[data-action="add-root"]').hide();
                $('[data-action="clear-container"]').show();
            } else {
                $('[data-action="add-root"]').show();
                $('[data-action="clear-container"]').hide();
            }

            //restrict the deletion of the main tree containers
            if (self.model.get('parent').classed("prime-container")) {
                $('[data-action="delete-container"]').hide();
            } else {
                $('[data-action="delete-container"]').show();
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
                case "load-schema":
                    self.loadFile();
                    break;
                case "clear-container":
                    self.confirmDeletion(self.clearContainer, "clear the container", "Clear container");
                    break;
                case "add-root":
                    self.addRootElement();
                    break;
                case "delete-container":
                    self.confirmDeletion(self.deleteContainer, "delete the container", "Delete container");
                    break;
                }
            }

            // Hide it AFTER the action was triggered
            $(menu).hide(100);
        });

    },
    confirmDeletion: function (refreshCallback, message, label) {
        BootstrapDialog.show({
            //            type: BootstrapDialog.TYPE_WARNING,
            title: label + "?",
            message: '<span class="glyphicon glyphicon-warning-sign"></span> Are you sure you want to ' + message + '?',
            draggable: true,
            buttons: [{
                    label: label,
                    cssClass: "btn-danger",
                    action: function (dialogRef) {
                        refreshCallback();
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
    deleteContainer: function () {
        Diagram.Connectors.findFromTargetContainer(this.model.get('parent')).map(function (connector) {
            connector.removeConnector();
        });
        Diagram.Connectors.findFromSourceContainer(this.model.get('parent')).map(function (connector) {
            connector.removeConnector();
        });
        if (this.model.get('parent').classed("operator")) {
            Diagram.Operators.remove(this.model);
        } else {
            Diagram.TreeContainers.remove(this.model);
        }
        this.model.get('parent').remove();
    },
    drawInitContainer: function () {},
    updateConnections: function (newX, newY) {
        var sourceContainer = d3.select(this.el);
        Diagram.Connectors.findFromSourceContainer(sourceContainer).map(function (connector) {
            connector.set("x2", connector.get("x2") - newX);
            connector.set("y2", connector.get("y2") - newY);
            connector.setPoints(connector.get('x1'), connector.get('x2'), connector.get('y1'), connector.get('y2'));
        });

        Diagram.Connectors.findFromTargetContainer(sourceContainer).map(function (connector) {
            connector.set("x2", Number(connector.get("x2")) + Number(newX));
            connector.set("y2", Number(connector.get("y2")) + Number(newY));
            connector.setPoints(connector.get('x1'), connector.get('x2'), connector.get('y1'), connector.get('y2'));
        });
    },
    resizeCanvas: function (x, y) {
        var tempY = Number(d3.select(this.el).select(".dmcontainer-outline").attr("height")) + y,
            tempX = Number(d3.select(this.el).select(".dmcontainer-outline").attr("width")) + x;
        var canvas = d3.select(Diagram.Canvas.el);
        if (canvas.attr("width") < tempX) {
            canvas.attr("width", tempX);
        }
        if (canvas.attr("height") < tempY) {
            canvas.attr("height", tempY);
        }

    }
});

DataMapper.Models.Container = Backbone.Model.extend({});