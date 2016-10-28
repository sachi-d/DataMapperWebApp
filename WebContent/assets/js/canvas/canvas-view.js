/**
 * Created by sachithra on 10/24/16.
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
        var inputModel = new DataMapper.Models.TreeContainer({
            type: "input",
            title: "Input",
            x: this.inputStartX,
            y: this.inputStartY
        });
        var inputView1 = new DataMapper.Views.TreeContainerView({
            id: "input-dmcontainer",
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
            id: "output-dmcontainer",
            model: outputModel
        });
        outputView1.render();

        Diagram.InputViews.push(inputView1);
        Diagram.OutputViews.push(outputView1);
        //                    this.render();
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
                    self.addOperator(id, newPosX, newPosY);
                }
            }
        });


    },
    addOperator: function (toolID, x, y) {
        var tool = Diagram.ToolList.getToolByID(toolID);
        var operator = new DataMapper.Models.Operator({
            title: tool.get('title'),
            x: x,
            y: y,
            inputTypes: tool.get('defaults').inputTypes,
            outputTypes: tool.get('defaults').outputTypes
        });
        var operatorView = new DataMapper.Views.OperatorView({id: operator.id, model: operator});

        operatorView.render();
        Diagram.Operators.add(operator);
    }
});