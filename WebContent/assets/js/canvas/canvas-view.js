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

DataMapper.Views.CanvasView = Backbone.View.extend({
    el: "#canvas",
    inputStartX: 40,
    inputStartY: 40,
    outputStartX: 1000,
    outputStartY: 40,
    initialize: function () {

    },
    initElements: function () {
        Diagram.Connectors = new DataMapper.Collections.Connectors();
        Diagram.VariableList = new DataMapper.Collections.NodeList();
        Diagram.Operators = new DataMapper.Collections.Operators();
        Diagram.TreeContainers = new DataMapper.Collections.TreeContainers();
        var inputModel = new DataMapper.Models.TreeContainer({
            type: "input",
            title: "Input",
            x: this.inputStartX,
            y: this.inputStartY
        });
        var inputView1 = new DataMapper.Views.TreeContainerView({
            id: "input-dmcontainer0",
            model: inputModel
        });
        inputView1.render();
        var outputModel = new DataMapper.Models.TreeContainer({
            type: "output",
            title: "Output",
            x: this.outputStartX,
            y: this.outputStartY
        });
        var outputView1 = new DataMapper.Views.TreeContainerView({
            id: "output-dmcontainer0",
            model: outputModel
        });
        outputView1.render();
        Diagram.TreeContainers.add([inputModel, outputModel]);
        inputModel.get('parent').classed("prime-container", true);
        outputModel.get('parent').classed("prime-container", true);
    },
    render: function () {
        this.initElements();
        var self = this;
        $("#canvas-container").droppable({
            drop: function (event, ui) {
                var newPosX = ui.offset.left - $(this).offset().left;
                var newPosY = ui.offset.top - $(this).offset().top;
                var id = ui.draggable[0].lastChild.id || null;
                if (id !== null) {
                    var tool = Diagram.ToolList.getToolByID(id);

                    if (tool.get('defaults').isContainer) {
                        self.addExtraSchema(tool, newPosX, newPosY);
                    } else {
                        self.addOperator(tool, newPosX, newPosY);
                    }
                }
            }
        });


    },
    addExtraSchema: function (tool, xx, yy) {
        var type = tool.get('defaults').type;

        var model = new DataMapper.Models.TreeContainer({
            type: type,
            title: tool.get('title'),
            x: xx, //this.model.get('x'),
            y: yy //this.model.updateContainerHeight()
        });
        var view = new DataMapper.Views.TreeContainerView({
            id: type + "-container-" + model.cid,
            model: model
        });
        view.render();
        Diagram.TreeContainers.add(model);
    },
    addOperator: function (tool, x, y) {

        var operator = new DataMapper.Models.Operator({
            title: tool.get('title'),
            x: x,
            y: y,
            inputTypes: tool.get('defaults').inputTypes,
            outputTypes: tool.get('defaults').outputTypes,
            inputLabels: tool.get('defaults').inputLabels,
            outputLabels: tool.get('defaults').outputLabels,
            arguments: tool.get('defaults').arguments
        });
        var operatorView = new DataMapper.Views.OperatorView({
            id: operator.id,
            model: operator
        });

        operatorView.render();
        Diagram.Operators.add(operator);
    }
});