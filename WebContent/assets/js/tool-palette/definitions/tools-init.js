/**
 * Created by sachithra on 10/21/16.
 */
    //Tools and tool groups definitions
var toolGroupDefs = [
        {
            toolGroupName: "Link",
            toolGroupID: "link-tool-group",
            tools: [
                {
                    title: "DataMapperLink",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                }
            ]
        },
        {
            toolGroupName: "Common",
            toolGroupID: "common-tool-group",
            tools: [
                {
                    title: "Constant",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "CustomFunction",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Properties",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Compare",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "GlobalVariable",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
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
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Subtract",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Multiply",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Divide",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Ceiling",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Floor",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Round",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "SetPrecision",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "AbsoluteValue",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Min",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Max",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
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
                    defaults: {inputCount: 1, outputCount: 2}
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
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "OR",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "NOT",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
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
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "StringToBoolean",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "ToString",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
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
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Split",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "LowerCase",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "UpperCase",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "StringLength",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "StartsWith",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "EndsWith",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Substring",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Trim",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Replace",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                },
                {
                    title: "Match",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg",
                    defaults: {inputCount: 1, outputCount: 2}
                }
            ]
        }
    ];


var toolPalette = (function renderToolPalette(toolPalette, definitions) {
    var idCount = 0;
    // var toolList = new DataMapper.Collections.ToolList();
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
            // toolList.add(tempTool);
            idCount++;
            tempToolGroup.toolCollection.add(tempTool);
        });
        toolPalette.add(tempToolGroup);
    });
    // DataMapper.ToolList = toolList;
    return toolPalette;
})(new Tools.Models.ToolPalatte(), toolGroupDefs);


var paletteView = new Tools.Views.ToolPalatteView({collection: toolPalette});
paletteView.render();