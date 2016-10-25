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

        $("#canvas-container").droppable({
            drop: this.handleDropEvent
        });


    },
    handleDropEvent: function (event, ui) {
        console.log("ddd");
        var id = ui.draggable[0].lastChild.id;
        console.log(this);
        var addOperator = function (toolID) {
            var tool = Diagram.ToolList.getToolByID(toolID);
            var operator = new DataMapper.Models.Operator({
                title: tool.get('title'),
                id: tool.cid,
                inputCount: tool.get('defaults').inputCount,
                outputCount: tool.get('defaults').outputCount,
                inputType: "String",
                outputType: "String"
            });
            var operatorView = new DataMapper.Views.OperatorView({model: operator});
            operatorView.render();
            Diagram.Operators.add(operator);
        };
        addOperator(id);
    },
    addOdperator: function (toolID) {
        console.log(toolID);
        var tool = Diagram.ToolList.getToolByID(toolID);
    }
});