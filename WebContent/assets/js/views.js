/**
 * Created by sachithra on 10/19/16.
 */





DataMapper.Views.OperatorPanelView = Backbone.View.extend({
    el: "#op-panel",
    events: {
        "click #concat-op-btn": "addConcatOp",
        "click #split-op-btn": "addSplitOp"
    },
    addConcatOp: function () {
        var concatModel = new DataMapper.Models.Operator({
            title: "Concat",
            id: "concat" + DataMapper.Operators.length,
            inputCount: 2,
            outputCount: 1,
            inputType: "String",
            outputType: "String"
        });
        var concatView = new DataMapper.Views.OperatorView({model: concatModel});
        DataMapper.Operators.add(concatModel);
    },
    addSplitOp: function () {
        var splitModel = new DataMapper.Models.Operator({
            title: "Split",
            id: "split" + DataMapper.Operators.length,
            inputCount: 1,
            outputCount: 3,
            inputType: "String",
            outputType: "String"
        });
        var splitView = new DataMapper.Views.OperatorView({model: splitModel});
        DataMapper.Operators.add(splitModel);
    }
});
