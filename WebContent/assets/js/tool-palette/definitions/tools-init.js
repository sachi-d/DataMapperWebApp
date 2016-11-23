/**
 * Created by sachithra on 10/21/16.
 */
//Tools and tool groups definitions
var toolGroupDefs = [{
    toolGroupName: "Tree containers",
    toolGroupID: "tree-containers",
    tools: [{
        title: "Input",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            isContainer: true,
            type: "input"
        }
        }]
    }, {
    toolGroupName: "Common",
    toolGroupID: "common-tool-group",
    tools: [{
        title: "Constant",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: [],
            outputTypes: ["String"],
            inputLabels: [],
            outputLabels: ["Const"]
        }
        }, {
        title: "CustomFunction",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String", "String"],
            outputTypes: ["String"],
            inputLabels: ["In", "In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Properties",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: [],
            outputTypes: ["String"],
            inputLabels: [],
            outputLabels: ["Value"]
        }
        }, {
        title: "Compare",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String", "String"],
            outputTypes: ["Boolean"],
            inputLabels: ["In", "In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "GlobalVariable",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: [],
            outputTypes: ["String"],
            inputLabels: [],
            outputLabels: ["Value"]
        }
        }]
    }, {
    toolGroupName: "Arithmetic",
    toolGroupID: "arithmetic-tool-group",
    tools: [{
        title: "Add",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number", "Number"],
            outputTypes: ["Number"],
            inputLabels: ["In", "In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Subtract",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number", "Number"],
            outputTypes: ["Number"],
            inputLabels: ["Number", "Subtrahend"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Multiply",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number", "Number"],
            outputTypes: ["Number"],
            inputLabels: ["In", "In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Divide",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number", "Number"],
            outputTypes: ["Number"],
            inputLabels: ["Number", "Divisor"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Ceiling",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number"],
            outputTypes: ["Number"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Floor",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number"],
            outputTypes: ["Number"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Round",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number"],
            outputTypes: ["Number"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "SetPrecision",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number", "Number"],
            outputTypes: ["Number"],
            inputLabels: ["In", "DecimalCount"],
            outputLabels: ["Result"]
        }
        }, {
        title: "AbsoluteValue",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number"],
            outputTypes: ["Number"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Min",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number", "Number"],
            outputTypes: ["Number"],
            inputLabels: ["In", "In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Max",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number", "Number"],
            outputTypes: ["Number"],
            inputLabels: ["In", "In"],
            outputLabels: ["Result"]
        }
        }]
    }, {
    toolGroupName: "Conditional",
    toolGroupID: "conditional-tool-group",
    tools: [{
        title: "IfElse",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Boolean", "String", "String"],
            outputTypes: ["String"],
            inputLabels: ["Condition", "Then", "Else"],
            outputLabels: ["Result"]
        }
        }]
    }, {
    toolGroupName: "Boolean",
    toolGroupID: "boolean-tool-group",
    tools: [{
        title: "AND",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Boolean", "Boolean"],
            outputTypes: ["Boolean"],
            inputLabels: ["In", "In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "OR",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Boolean", "Boolean"],
            outputTypes: ["Boolean"],
            inputLabels: ["In", "In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "NOT",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Boolean"],
            outputTypes: ["Boolean"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }]
    }, {
    toolGroupName: "Type Conversion",
    toolGroupID: "typeConversion-tool-group",
    tools: [{
        title: "StringToNumber",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String"],
            outputTypes: ["Number"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "StringToBoolean",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String"],
            outputTypes: ["Boolean"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "ToString",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["Number"],
            outputTypes: ["String"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }]
    }, {
    toolGroupName: "String",
    toolGroupID: "string-tool-group",
    tools: [{
        title: "Concat",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String", "String"],
            outputTypes: ["String"],
            inputLabels: ["In", "In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Split",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String"],
            outputTypes: ["String", "String"],
            inputLabels: ["In"],
            outputLabels: ["Result", "Result"]
        }
        }, {
        title: "LowerCase",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String"],
            outputTypes: ["String"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "UpperCase",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String"],
            outputTypes: ["String"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "StringLength",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String"],
            outputTypes: ["Number"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "StartsWith",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String", "String"],
            outputTypes: ["Boolean"],
            inputLabels: ["Value", "Pattern"],
            outputLabels: ["Result"]
        }
        }, {
        title: "EndsWith",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String", "String"],
            outputTypes: ["Boolean"],
            inputLabels: ["Value", "Pattern"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Substring",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String", "Number", "Number"],
            outputTypes: ["String"],
            inputLabels: ["Value", "StartIndex", "Length"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Trim",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String"],
            outputTypes: ["String"],
            inputLabels: ["In"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Replace",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String", "String", "String"],
            outputTypes: ["String"],
            inputLabels: ["In", "Target", "ReplaceWith"],
            outputLabels: ["Result"]
        }
        }, {
        title: "Match",
        icon: "assets/images/tool-icons/sample-tool-icon.svg",
        defaults: {
            arguments: [],
            inputTypes: ["String", "String"],
            outputTypes: ["Boolean"],
            inputLabels: ["In", "Pattern"],
            outputLabels: ["Result"]
        }
        }]
    }];


var toolPalette = (function renderToolPalette(toolPalette, definitions) {
    var idCount = 0;
    var toolList = new DataMapper.Collections.ToolList();
    definitions.map(function (toolGroup) {
        var tempToolGroup = new Tools.Models.ToolGroup({
            toolGroupName: toolGroup.toolGroupName,
            toolGroupID: toolGroup.toolGroupID
        });
        toolGroup.tools.map(function (tool) {
            var tempTool = new Tools.Models.Tool({
                id: idCount,
                title: tool.title,
                icon: tool.icon,
                defaults: tool.defaults
            });
            toolList.add(tempTool);
            idCount++;
            tempToolGroup.toolCollection.add(tempTool);
        });
        toolPalette.add(tempToolGroup);
    });
    Diagram.ToolList = toolList;
    return toolPalette;
})(new Tools.Models.ToolPalatte(), toolGroupDefs);


var paletteView = new Tools.Views.ToolPalatteView({
    collection: toolPalette
});
paletteView.render();

// toolGroupDefs.map(function (group) {
//     group.tools.map(function (tool) {
//         tool.defaults.inputLabels = tool.defaults.inputTypes;
//         tool.defaults.outputLabels = tool.defaults.outputTypes;
//     })
// });
// console.log(JSON.stringify(toolGroupDefs));