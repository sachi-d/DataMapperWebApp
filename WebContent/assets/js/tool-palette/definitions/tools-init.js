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
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                }
            ]
        },
        {
            toolGroupName: "Common",
            toolGroupID: "common-tool-group",
            tools: [
                {
                    title: "Constant",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "CustomFunction",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Properties",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Compare",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "GlobalVariable",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
            ]
        },
        {
            toolGroupName: "Arithmetic",
            toolGroupID: "arithmetic-tool-group",
            tools: [
                {
                    title: "Add",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Subtract",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Multiply",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Divide",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Ceiling",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Floor",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Round",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "SetPrecision",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "AbsoluteValue",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Min",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Max",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                }
            ]
        },
        {
            toolGroupName: "Conditional",
            toolGroupID: "conditional-tool-group",
            tools: [
                {
                    title: "IfElse",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                }
            ]
        },
        {
            toolGroupName: "Boolean",
            toolGroupID: "boolean-tool-group",
            tools: [
                {
                    title: "AND",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "OR",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "NOT",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                }
            ]
        },
        {
            toolGroupName: "Type Conversion",
            toolGroupID: "typeConversion-tool-group",
            tools: [
                {
                    title: "StringToNumber",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "StringToBoolean",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "ToString",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                }
            ]
        },
        {
            toolGroupName: "String",
            toolGroupID: "string-tool-group",
            tools: [
                {
                    title: "Concat",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Split",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "LowerCase",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "UpperCase",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "StringLength",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "StartsWith",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "EndsWith",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Substring",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Trim",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Replace",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                },
                {
                    title: "Match",
                    icon: "assets/images/tool-icons/sample-tool-icon.svg"
                }
            ]
        }
    ];



var toolPalette=(function renderToolPalette(toolPalette, definitions){
    var idCount=0;

    definitions.map(function(toolGroup){
        var tempToolGroup=new Tools.Models.ToolGroup({
            toolGroupName:toolGroup.toolGroupName,
            toolGroupID:toolGroup.toolGroupID
        });
        toolGroup.tools.map(function(tool){
            var tempTool=new Tools.Models.Tool({
                id:idCount,
                title:tool.title,
                icon:tool.icon
            });
            idCount++;
            tempToolGroup.toolCollection.add(tempTool);
        });
        toolPalette.add(tempToolGroup);
    });
    return toolPalette;
})(new Tools.Models.ToolPalatte(), toolGroupDefs);


var paletteView = new Tools.Views.ToolPalatteView({collection: toolPalette});
paletteView.render();