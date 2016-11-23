/**
 * Created by sachithra on 10/24/16.
 */

DataMapper.Views.TreeStructureView = Backbone.View.extend({

    initialize: function () {

    },
    render: function () {

    },

});

DataMapper.Models.TreeStructure = Backbone.Model.extend({
    parentContainer: null,
    data: null,
    rootTitle: "title",
    level: 0,
    rank: 0,
    resultPane: d3.select("#canvas"),
    parentNode: null,
    children: null,
    initialize: function () {
        this.set('children', {}); // title: tree
    },
    drawTree: function (root) {

        var rootName = this.get('rootTitle'),
            resultPane = this.get('resultPane'),
            parentNode = this.get('parentNode'),
            level = this.get('level'),
            rank = this.get('rank'),
            nodeCollection = this.get('parentContainer').get('nodeCollection'),
            x = 0,
            y = level * this.get('parentContainer').get('nodeHeight'),
            overhead = rank * this.get('parentContainer').get('rankMargin'),
            tempParent = null;
        if (root.type === "object") {
            if (rootName !== "") {
                node = this.drawTreeNode(resultPane, parentNode, rootName, root.type, "object", false, x, y, overhead);
                nodeCollection.add(node);
                rank++;
                level++;

            } else {
                node = parentNode;
            }
            tempParent = node.get('supportGroup');
            var keys = root.properties || {}; //select PROPERTIES
            for (var i = 0; i < Object.keys(keys).length; i++) { //traverse through each PROPERTY of the object 
                var keyName = Object.keys(keys)[i];
                var key = keys[keyName];
                var tree = new DataMapper.Models.TreeStructure({
                    parentContainer: this.get('parentContainer'),
                    data: key,
                    rootTitle: keyName,
                    level: level,
                    rank: rank,
                    resultPane: tempParent,
                    parentNode: node,
                });
                level = tree.drawTree(key);
                this.get('children')[keyName] = tree;
            }

        } else if (root.type === "array") {
            //            console.log(root);
            var keys = root.items || {}; //select ITEMS
            if (rootName !== "") {
                var nodeText = rootName;
                node = this.drawTreeNode(resultPane, parentNode, nodeText, keys.type, "array", !keys.hasOwnProperty("properties"), x, y, overhead);
                nodeCollection.add(node);
                rank++;
                level++;
                tempParent = node.get('supportGroup');
            }
            if (keys.properties) {
                var tree = new DataMapper.Models.TreeStructure({
                    parentContainer: this.get('parentContainer'),
                    data: keys,
                    rootTitle: "",
                    level: level,
                    rank: rank,
                    resultPane: node.get('supportGroup'),
                    parentNode: node,
                });
                level = tree.drawTree(keys);
                this.get('children')["items"] = tree;
            } else {
                tempParent = node.get('supportGroup');
            }

        } else { //if (DataMapper.Types.indexOf(root.type) > -1) {    //when the type is a primitive
            if (rootName !== "") {
                var nodeText = rootName;
                node = this.drawTreeNode(resultPane, parentNode, nodeText, root.type, "leaf", true, x, y, overhead);
                nodeCollection.add(node);
                rank++;
                level++;
                tempParent = node.get('supportGroup')
            }
        }
        if (root.attributes) {
            var keys = root.attributes;
            for (var i = 0; i < Object.keys(keys).length; i++) { //traverse through each PROPERTY of the object
                var keyName = Object.keys(keys)[i];
                var key = keys[keyName];
                y = level * this.get('parentContainer').get('nodeHeight');
                overhead = rank * this.get('parentContainer').get('rankMargin');
                node = this.drawTreeNode(tempParent, node, keyName, key.type, "attribute", true, x, y, overhead);
                nodeCollection.add(node);
                level++;
            }
        }
        return level;
    },
    drawTreeNode: function (parent, parentNode, text, textType, category, isLeaf, x, y, overhead) {
        var parentContainer = this.get('parentContainer');
        var node = new DataMapper.Models.Node({
            parent: parent,
            parentNode: parentNode,
            parentContainer: parentContainer,
            text: text,
            textType: textType,
            x: x,
            y: y,
            type: parentContainer.get('type'),
            category: category,
            isLeaf: isLeaf,
            height: parentContainer.get('nodeHeight'),
            width: parentContainer.get('containerWidth'),
            isSchema: true,
            overhead: overhead
        });
        new DataMapper.Views.NodeView({
            model: node
        }).render();
        var group = parent.append("g").attr("class", "nested-group");
        node.set('supportGroup', group);
        return node;
    },
    getPath: function (search) {
        function iter(o, p) {
            return Object.keys(o).some(function (k) {
                if (k === search && o[k]) {
                    path = p.concat(k).join('.');
                    return true;
                }
                if (o[k] !== null && typeof o[k] === 'object') {
                    return iter(o[k],
                        k === 'properties' && !o.title ? p : p.concat(k === 'properties' && o.title ? o.title : k));
                }
            });
        }
        var path;
        iter(this.get('parentContainer').get('data'), []);
        return path;
    }
});