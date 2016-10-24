/**
 * Created by sachithra on 10/19/16.
 */

DataMapper.Views.NodeView = Backbone.View.extend({
    el: ".node-element",
    initialize: function () {
        this.model.drawNode();
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
        if (this.get('type') === "input") {
            this.set('dotPosition', [this.get('x') + this.get('width'), this.get('y') + this.get('height') / 2]);
        } else if (this.get('type') === "output") {
            this.set('dotPosition', [this.get('x'), this.get('y') + this.get('height') / 2]);
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
            .attr("width", width);
        this.set('node', parent1);

        //                    <foreignObject x="15" y="15" width="190" height="90">
        //                            <div xmlns="http://www.w3.org/1999/xhtml" style="width:190px; height:90px; overflow-y:auto"><b>This</b> is the <i>text</i> I wish to fit inside <code>rect</code></div>
        //                    </foreignObject>
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

        return parent1;
    },
    drawContainerNode: function (overhead, isLeaf) {
        var obj = this.drawNode();
        obj.select("text").attr("x", this.get("x") + 12 + overhead);
        var model = this;
        obj.append("svg:image")
            .attr("x", this.get('x') + overhead)
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
        if (!isLeaf) {
            obj.classed("parent-node", true);
            obj.classed("leaf-node", false);
            obj.select(".drag-head").remove();
        }
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
