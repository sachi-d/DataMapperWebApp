/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


DataMapper.Views.OperatorView = DataMapper.Views.ContainerView.extend({
    el: "#canvas",
    menu: "#operator-menu",

    drawInitContainer: function () {
        return this.model.drawContainer();
    }
});

DataMapper.Models.Operator = DataMapper.Models.Container.extend({
    title: "Operator",
    id: "id",
    inputCount: 0,
    outputCount: 0,
    inputs: [],
    outputs: [],
    parent: d3.select("canvas"),
    defaults: {
        x: 400,
        y: 40,
        leaves: [],
        height: 20,
        width: 120,
        color: "#f3f5f6",
    },
    nodeCollection: null,
    initialize: function () {
        this.set('id', this.get('title') + "-" + this.cid);
        this.set('nodeCollection', new DataMapper.Collections.NodeList());
        this.set('inputCount', this.get('inputLabels').length);
        this.set('outputCount', this.get('outputLabels').length);
    },

    drawContainer: function () {
        this.set('inputs', []);
        this.set('outputs', []);
        var canvas = d3.select(Diagram.Canvas.el);
        var parent = canvas.append("g").attr("class", "operator dmcontainer")
            .attr("id", this.get('id'))
            .attr("transform", "translate(" + this.get('x') + "," + this.get('y') + ")");
        this.set('parent', parent);
        var inputCount = this.get('inputCount'),
            outputCount = this.get('outputCount');
        var max = d3.max([inputCount, outputCount]);
        var opTitleOutline = parent.append("rect").attr("class", "dmcontainer-title-outline dmcontainer-structure")
            .attr("width", 2 * this.get('width'))
            .attr("height", 20) //height of the rect title=20
            .attr("x", 0)
            .attr("y", 0)
            .attr("fill", this.get('color'))
            .attr("stroke", "black")
            .attr("cursor", "move");
        var opTitle = parent.append("text").attr("class", "dmcontainer-title dmcontainer-structure")
            .attr("font-weight", "bold")
            .attr("x", 0)
            .attr("y", 15)
            .text(this.get('title'))
            .attr("cursor", "move");
        var opContainerOutline = parent.append("rect").attr("class", "dmcontainer-outline dmcontainer-structure")
            .attr("width", 2 * this.get('width'))
            .attr("height", max * this.get('height'))
            .attr("x", 0)
            .attr("y", 20)
            .attr("fill", "none")
            .attr("stroke", "black");
        var inputs = parent.append("g").attr("class", "op-inputs");
        var outputs = parent.append("g").attr("class", "op-outputs");
        var x = 0,
            y = Number(opTitleOutline.attr("height"));
        if (inputCount !== 0) {
            var tempHeight = this.get('height');
            if (max !== inputCount) {
                tempHeight = (max * this.get('height') / inputCount);
            }
            for (var i = 0; i < inputCount; i++) {
                var tempY = y + i * tempHeight;
                var node = new DataMapper.Models.Node({
                    parent: inputs,
                    parentContainer: this,
                    text: this.get('inputLabels')[i],
                    textType: this.get('inputTypes')[i],
                    x: x,
                    y: tempY,
                    type: "output",
                    category: "operator",
                    isLeaf: true,
                    height: tempHeight,
                    width: this.get('width'),
                    isSchema: false,
                    overhead: 0
                });
                var obj = new DataMapper.Views.NodeView({
                    model: node
                }).render();
                obj.attr("rank", i);
                this.get('inputs').push(obj);
                this.get('nodeCollection').add(node);
            }

            x += this.get('width');
        } else {
            this.set('width', opTitleOutline.attr("width"));
        }
        if (outputCount !== 0) {
            var tempHeight = this.get('height');
            if (max !== outputCount) {
                tempHeight = (max * this.get('height') / outputCount);
            }
            for (var i = 0; i < outputCount; i++) {
                var tempY = y + i * tempHeight;
                var node = new DataMapper.Models.Node({
                    parent: outputs,
                    parentContainer: this,
                    text: this.get('outputLabels')[i],
                    text: this.get('outputLabels')[i],
                    textType: this.get('outputTypes')[i],
                    x: x,
                    y: tempY,
                    type: "input",
                    category: "operator",
                    isLeaf: true,
                    height: tempHeight,
                    width: this.get('width'),
                    isSchema: false,
                    overhead: 0
                });
                var obj = new DataMapper.Views.NodeView({
                    model: node
                }).render();
                obj.attr("rank", i);
                this.get('outputs').push(obj);
                this.get('nodeCollection').add(node);
            }

        }
        return parent;
    }
});

DataMapper.Collections.Operators = Backbone.Collection.extend({
    model: DataMapper.Models.Operator,
    url: "/operators",
    getOperatorByID: function (id) {
        return this.find(function (item) {
            return item.get("id") === id;
        });
    }
});