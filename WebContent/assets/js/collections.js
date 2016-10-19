/**
 * Created by sachithra on 10/19/16.
 */
DataMapper.Collections.Operators = Backbone.Collection.extend({
    model: DataMapper.Models.Operator,
    url: "/operators",
    findOperator: function (id) {
        return this.find(function (item) {
            return item.get("id") === id;
        });
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
DataMapper.Collections.NodeList = Backbone.Collection.extend({
    model: DataMapper.Models.Node,
    url: "/nodelist",
    getNodeFromDOMObject: function (object) {
        return this.find(function (node) {
            return node.get("node").node().isSameNode(object);
        });
    }
});
