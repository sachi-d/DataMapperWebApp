/**
 * Created by sachithra on 10/24/16.
 */
DataMapper.Models.Connector = Backbone.Model.extend({
    sourceContainer: d3.select("#canvas"), //container
    sourceNode: null, //node (g)
    sourcePath: null,
    targetContainer: d3.select("#canvas"),
    targetNode: null,
    targetPath: null,
    line: null,
    status: 1,
    val: 5,
    initialize: function () {
        Diagram.Connectors.add(this);
        //if the line is direct
        if (null !== this.get('line') && this.get('sourceContainer').classed("tree-dmcontainer") && this.get('targetContainer').classed("tree-dmcontainer")) {
            this.addDirectOperator();
        }
    },
    addDirectOperator: function () {
//                    var self = this;
        var operator = new DataMapper.Models.Operator({
            title: "directOperator",
            id: "direct" + Diagram.Operators.length,
            inputCount: 1,
            outputCount: 1
        });
        var head = Diagram.InputView.model.get('nodeCollection').getNodeFromDOMObject(this.get('sourceNode').node()).clone();
        var tail = Diagram.OutputView.model.get('nodeCollection').getNodeFromDOMObject(this.get('targetNode').node()).clone();
        operator.get('nodeCollection').add([head, tail]);
        Diagram.Operators.add(operator);
    },
    removeConnector: function () {
        this.get("line").remove();
        //TODO Diagram.Connectors.remove(this);
    }
});

DataMapper.Collections.Connectors = Backbone.Collection.extend({
    model: DataMapper.Models.Connector,
    url: "/connectors",
    findFromTarget: function (targetNode) { //know the target
        return this.find(function (item) { //assuming target can have only one source
            if (item.get("targetNode").node().isSameNode(targetNode.node()))
                return item;
        });
    },
    findFromSource: function (sourceNode) { //know the source
        var array = this.filter(function (d) { //assuming a source can have multiple targets
            if (d.get('sourceNode').node().isSameNode(sourceNode.node())) {
                return d;
            }
        });
        return array;
    }

});