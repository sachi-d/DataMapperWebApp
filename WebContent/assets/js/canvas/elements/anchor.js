/**
 * Created by sachithra on 10/24/16.
 */
DataMapper.Views.AnchorView = Backbone.View.extend({
    el: ".drag-head",
    initialize: function () {
        this.model.drawArrow();
    }
});
DataMapper.Models.Anchor = Backbone.Model.extend({
    defaults: {
        parent: d3.select(Diagram.Canvas.el),
        cx: 0,
        cy: 0,
        width: 10,
        height: 10,
        points: "",
        type: "input"
    },
    dragAnchor: function () {
        var self = this;
        return d3.drag()
            .on("start", function (d) {
                var thisDragY = d3.select(this).attr("cy");
                var thisDragX = d3.select(this).attr("cx");
                var tempParent = d3.select(d3.select(this)["_groups"][0][0].parentNode);
                dragHead2 = self.drawDragArrow(tempParent, thisDragX, thisDragY);
                dragLine = tempParent.append("line").attr("class", "drag-line")
                    .style("stroke", "black")
                    .style("stroke-width", "2");
                dragLine.attr("x1", thisDragX)
                    .attr("x2", thisDragX)
                    .attr("y1", thisDragY)
                    .attr("y2", thisDragY);
            })
            .on("drag", function (d) {
                coordinates = d3.mouse(this);
                xx = coordinates[0];
                yy = coordinates[1];
                dragLine.attr("x2", xx).attr("y2", yy);
                self.moveArrow(dragHead2, xx, yy);
            })
            .on("end", function (d) {
                var sourceContainer = self.getParentContainer(d3.select(this));
                var sourceNode = d3.select(d3.select(this)["_groups"][0][0].parentNode);
                target = self.detectDropNode(xx, yy, sourceNode.attr("type"), sourceContainer);
                if (target) {
                    //limit the connections to one - in output targets
                    if (target.attr("type") === "output") {
                        //loop through connectors to find targetNode=target and remove line
                        var duplicate = Diagram.Connectors.findFromTarget(target) || null;
                        if (duplicate !== null) {
                            duplicate.get('line').remove();
                            Diagram.Connectors.remove(duplicate);
                        }
                    }
                    var oppositeContainer = self.getParentContainer(target);
                    var dotx = Number(target.select(".drag-head").attr("cx")) + self.getTranslateX(oppositeContainer) - self.getTranslateX(sourceContainer);
                    var doty = Number(target.select(".drag-head").attr("cy")) + self.getTranslateY(oppositeContainer) - self.getTranslateY(sourceContainer);
                    dragLine
                        .attr("x2", dotx)
                        .attr("y2", doty)
                        .attr("target-dmcontainer", oppositeContainer.attr("id"));
                    dragHead2.remove();
                    var map = new DataMapper.Models.Connector({
                        sourceContainer: sourceContainer,
                        targetContainer: oppositeContainer,
                        sourceNode: sourceNode,
                        targetNode: target,
                        line: dragLine
                    });
                    if (oppositeContainer.classed("operator")) {
                        target.select("text").text(sourceNode.select("text").text().split(":")[0]).classed("op-node-text", true);
                    }
                } else {
                    //d3.select("#inputnode").text("");
                    dragLine.remove();
                    dragHead2.remove();
                }
            });
    },
    drawArrow: function () {
        var newArrow = this.get('parent').append("polygon").attr("class", "drag-head").attr("cursor", "pointer");
        this.moveArrow(newArrow, this.get('cx'), this.get('cy'));
        if (this.get('type') === "input") {
            newArrow.attr("fill", "#019999");
            newArrow.call(this.dragAnchor());
        } else {
            newArrow.attr("fill", "#c9c9c9");
        }
    },
    drawDragArrow: function (parent, cx, cy) {
        var newArrow = parent.append("polygon").attr("class", "drag-head-2");
        this.moveArrow(newArrow, cx, cy);
        return newArrow;
    },
    moveArrow: function (arrow, cx, cy) {
        arrow.attr("points", function () {
            var p0 = [Number(cx) - 5, Number(cy) - 5],
                p1 = [Number(cx) + 5, Number(cy)],
                p2 = [Number(cx) - 5, Number(cy) + 5];
            return p0[0] + "," + p0[1] + " " + p1[0] + "," + p1[1] + " " + p2[0] + "," + p2[1];
        })
            .attr("cx", cx)
            .attr("cy", cy);
    },
    getTranslation: function (transform) {
        // Create a dummy g for calculation purposes only. This will never
        // be appended to the DOM and will be discarded once this function
        // returns.
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        // Set the transform attribute to the provided string value.
        g.setAttributeNS(null, "transform", transform);
        // consolidate the SVGTransformList containing all transformations
        // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
        // its SVGMatrix.
        var matrix = g.transform.baseVal.consolidate().matrix;
        // As per definition values e and f are the ones for the translation.
        return [matrix.e, matrix.f];
    },
    getParentTransform: function (elementObject) { //parameter is an element in an object - inputs or outputs array
        var transform = d3.select(elementObject["_groups"][0][0].parentNode).attr("transform");
        return transform;
    },
    getTranslateX: function (sourceContainer) {
        return Number(this.getTranslation(sourceContainer.attr("transform"))[0]);
    },
    getTranslateY: function (sourceContainer) {
        return Number(this.getTranslation(sourceContainer.attr("transform"))[1]);
    },
    getParentContainer: function (nodeElement) { //a recursive method to find g.container of an element
        if (nodeElement.classed("dmcontainer")) {
            return nodeElement;
        } else {
            return this.getParentContainer(d3.select(nodeElement["_groups"][0][0].parentNode));
        }
    },
    detectDropNode: function (xx, yy, type, sourceContainer) { //detect if a drop is near opposite type of drag-head
        var flag = false, self = this;
        d3.select("#canvas").selectAll(".leaf-node").each(function () { //assuming every leaf node has an anchor
            if (!flag && d3.select(this).attr("type") === "output") {
                var anchor = d3.select(this).select(".drag-head");
                if (anchor !== null) {
                    var x = Number(anchor.attr("cx")) + self.getTranslateX(self.getParentContainer(d3.select(this))) - self.getTranslateX(sourceContainer);
                    var y = Number(anchor.attr("cy")) + self.getTranslateY(self.getParentContainer(d3.select(this))) - self.getTranslateY(sourceContainer);
                    if (self.pointInRect([xx, yy], x - 10, x + 10, y - 10, y + 10)) {
                        flag = d3.select(this);
                    }
                }
            }
        });
        return flag;
    },
    pointInRect: function (point, x1, x2, y1, y2) { //determines if the point(array of coord) is bouded by the rectangle

        if (point[0] > x1 && point[0] < x2) {
            //horizontally inside
            if (point[1] > y1 && point[1] < y2) {
                //vertically in
                return true;
            }
        }
        return false;
    }
});