/**
 * Created by sachithra on 10/21/16.
 */
    //Tools and tool groups definitions
var toolGroupDefs = [
        {
            toolGroupName: "Common",
            toolGroupID: "common-tool-group",
            tools: [
                {
                    title: "Constant",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "CustomFunction",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Properties",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Compare",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "GlobalVariable",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
            ]
        },
        {
            toolGroupName: "Arithmetic",
            toolGroupID: "arithmetic-tool-group",
            tools: [
                {
                    title: "Add",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Subtract",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Multiply",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Divide",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Ceiling",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Floor",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Round",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "SetPrecision",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "AbsoluteValue",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Min",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Max",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                }
            ]
        },
        {
            toolGroupName: "Conditional",
            toolGroupID: "conditional-tool-group",
            tools: [
                {
                    title: "IfElse",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                }
            ]
        },
        {
            toolGroupName: "Boolean",
            toolGroupID: "boolean-tool-group",
            tools: [
                {
                    title: "AND",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String", "String"], outputTypes: ["String"]}
                },
                {
                    title: "OR",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String", "String"], outputTypes: ["String"]}
                },
                {
                    title: "NOT",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String"]}
                }
            ]
        },
        {
            toolGroupName: "Type Conversion",
            toolGroupID: "typeConversion-tool-group",
            tools: [
                {
                    title: "StringToNumber",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "StringToBoolean",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "ToString",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                }
            ]
        },
        {
            toolGroupName: "String",
            toolGroupID: "string-tool-group",
            tools: [
                {
                    title: "Concat",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String", "String"], outputTypes: ["String"]}
                },
                {
                    title: "Split",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "LowerCase",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String"]}
                },
                {
                    title: "UpperCase",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String"]}
                },
                {
                    title: "StringLength",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["Int"]}
                },
                {
                    title: "StartsWith",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "EndsWith",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Substring",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Trim",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Replace",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                },
                {
                    title: "Match",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputTypes: ["String"], outputTypes: ["String", "String"]}
                }
            ]
        }
    ];


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


var paletteView = new Tools.Views.ToolPalatteView({collection: toolPalette});
paletteView.render();