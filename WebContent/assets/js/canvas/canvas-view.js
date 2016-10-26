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
            x: this.inputStartX,
            y: this.inputStartY
        });
        Diagram.InputView = new DataMapper.Views.TreeContainerView({
            id: "input-dmcontainer",
            model: inputModel,
            text: "Input",
            color: "#D3DA7B"
        });
        var outputModel = new DataMapper.Models.TreeContainer({
            type: "output",
            x: this.outputStartX,
            y: this.outputStartY
        });
        Diagram.OutputView = new DataMapper.Views.TreeContainerView({
            id: "output-dmcontainer",
            model: outputModel,
            text: "Output",
            color: "#FCE0D3"
        });
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
            inputCount: tool.get('defaults').inputCount,
            outputCount: tool.get('defaults').outputCount,
            inputTypes: tool.get('defaults').inputTypes,
            outputTypes: tool.get('defaults').outputTypes,
            inputType: "String",
            outputType: "String"
        });
        var operatorView = new DataMapper.Views.OperatorView({model: operator, id: operator.id});
        operatorView.render();
        Diagram.Operators.add(operator);
    }
});