var Schemify = {

    initSchema: function () {
        var schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
        };
        return schema;
    },
    JSONtoJSONSchema: function (obj) {
        var schema = this.initSchema();
        if (Object.keys(obj).length === 1) {
            var title = Object.keys(obj)[0];
            schema["title"] = title;
            obj = obj[title];
        }

        var objType = typeof obj;
        schema["type"] = objType;
        if (objType !== "object") {
            schema["properties"] = {};
            return schema;

        }
        var str = Array.isArray(obj) ? "items" : "properties";
        schema[str] = {};

        (function traverse(obj, result) {
            var keys = Object.keys(obj);
            keys.map(function (key) {
                var subject = obj[key];
                var type = typeof subject;
                //if type is object or array
                if (type === "object") {
                    //if Array
                    if (Array.isArray(subject)) {
                        result[key] = {
                            "type": "array"
                        };
                        var arrayType = typeof subject[0];
                        var tempObject = {
                            "items": {}
                        };
                        if (arrayType !== "object") {
                            tempObject.items["type"] = arrayType;
                            result[key].items = tempObject.items;
                            return true;
                        } else {
                            tempObject.items = subject[0];
                            return traverse(tempObject, result[key]);
                        }
                    } else {
                        result[key] = {
                            "type": type,
                            "properties": {}
                        };
                        return traverse(subject, result[key].properties);
                    }
                }
                //if leaf type
                else {
                    result[key] = {
                        "type": type
                    };
                    return true;
                }
            });
        })(obj, schema[str]);
        return schema;
    },

    XMLtoJSONSchema: function (xmlText) {
        var schema = this.initSchema();
        var self = this;

        function traverseXMLTree(rootNode, parent) {
            var children = rootNode.children;
            var attributes = rootNode.attributes;
            var title = rootNode.tagName;
            if (parent[title]) { //if already defined
                var temp = parent[title];
                parent[title] = {
                    "type": "array",
                    "items": temp
                };
                return;
            } else {
                parent[title] = {
                    "type": self.getType(rootNode.textContent)
                };
            }
            if (children.length === 0 && attributes.length === 0) {
                return;
            } else {
                if (children.length !== 0) {
                    parent[title] = {
                        "type": "object",
                        "properties": {}
                    };
                    var nestParent = parent[title]["properties"];
                    //    $("#" + resultBox).append(nodeName);
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        traverseXMLTree(child, nestParent);
                    }
                }
                if (attributes.length !== 0) {
                    var obj = {};
                    for (var j = 0; j < attributes.length; j++) {
                        var attr = attributes[j];
                        obj[attr.name] = {
                            "type": self.getType(attr.textContent)
                        }
                    }
                    parent[title]["attributes"] = obj;
                }
            }
        }

        //parse XML tree
        function parseXMLTree(inputText, result) {
            parser = new DOMParser();
            var xmlDoc = parser.parseFromString(inputText, "text/xml");
            // documentElement always represents the root node
            var root = xmlDoc.documentElement;
            console.log(root);
            result["title"] = root.tagName;
            result["type"] = "object";
            result["properties"] = {};
            for (var i = 0; i < root.children.length; i++) {
                traverseXMLTree(root.children[i], result["properties"]);
            }

            return result;
        }
        parseXMLTree(xmlText, schema);
        console.log(schema);
        return schema;
    },



    getType: function (text) {
        if (text === "true" || text === "false") {
            return "boolean";
        }
        if (!isNaN(Number(text))) {
            return "number";
        }
        return "string";
    }
}