/**
 * Created by sachithra on 10/24/16.
 */
DataMapper.Views.CanvasView = Backbone.View.extend({
    el: "#canvas",
    inputStartX: 40,
    inputStartY: 40,
    outputStartX: 1000,
    outputStartY: 40,
    initElements: function () {
        // new DataMapper.Views.LoadFileView();
        // new DataMapper.Views.OperatorPanelView();

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
    }
});