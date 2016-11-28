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

        //parse XML tree
        var root = this.parseXMLTree(xmlText);

        schema["title"] = root.tagName;
        schema["type"] = "object";
        schema["properties"] = {};
        if (root.attributes.length > 0) {
            var obj = {};
            for (var j = 0; j < root.attributes.length; j++) {
                var attr = root.attributes[j];
                obj[attr.name] = {
                    "type": self.getType(attr.textContent)
                }
            }
            schema["attributes"] = obj;
        }
        for (var i = 0; i < root.children.length; i++) {
            traverseXMLTree(root.children[i], schema["properties"]);
        }

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

        return schema;
    },

    XSDtoJSONSchema: function (xsdText) {
        var schema = this.initSchema();
        schema["title"] = "Root",
            schema["properties"] = {},
            schema["type"] = "object",
            schema["attributes"] = {};

        var root = this.parseXMLTree(xsdText);

        var complexTypes = {};
        var ignoreTags = ["any", "anyAttribute", "sequence", "all", "choice"];
        var ignoreAttributes = ["substitutionGroups", "default", "fixed", "use", "maxOccurs", "minOccurs"];
        var namespaces = []; //the first entry is default namespace
        var schemaAttributes = root.attributes;
        var generalElements = root.children;

        //filter the namespaces eg.xs,xsd,xsi...
        for (var i = 0; i < schemaAttributes.length; i++) {
            var attr = schemaAttributes[i];
            var splitKey = attr.name.split(":");
            if (splitKey.length > 1 && splitKey[0] === "xmlns") {
                namespaces.push(splitKey[1]);
                if (attr.value.includes("http://www.w3.org") && i !== 0) { //set primary as first
                    var prim = namespaces.pop();
                    namespaces.push(namespaces[0]);
                    namespaces[0] = prim;
                }
            }
        }
        //        console.log(namespaces);

        //filter complexType definitions and root
        var rootElement;
        for (var i = 0; i < generalElements.length; i++) {
            var child = generalElements[i];
            var tagName = getTagName(child.tagName);
            if (tagName) {
                var name = child.attributes.name.value;
                if (child.attributes.type) {
                    var type = child.attributes.type.value;
                }
                if (tagName === "complexType" && child.attributes.name) {
                    var val = getComplexSchemaTemplate(child);
                    complexTypes[name] = val;
                } else if (tagName === "element") {
                    schema["title"] = name;
                    rootElement = child;
                }
            }
        }


        function traverseXSDTree(root, result) {

        }

        function getTagName(name) {
            var keys = name.split(":");
            if (keys.length == 2 && namespaces.indexOf(keys[0] > -1)) {
                return keys[1];
            }
        }

        function getComplexSchemaTemplate(root) {
            var obj = {};
            for (var j = 0; j < root.children.length; j++) {
                var child = root.children[j];
                var tagName = getTagName(child.tagName);
                if (tagName) {
                    if (ignoreTags.indexOf(tagName) > -1) {

                    } else if (tagName === "attribute") {

                    }
                }
            }
            return obj;
        }

        function addSchemaItem(result, key, type) {
            var obj = {
                "type": type
            }
            result[key] = obj;
            console.log(obj);
            return obj;
        }

        return schema;
    },
    parseXMLTree: function (xmlText) {
        parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlText, "text/xml");
        // documentElement always represents the root node
        var root = xmlDoc.documentElement;
        return root;
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