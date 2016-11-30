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
        var self = this;
        var schema = this.initSchema();
        schema["title"] = "Root",
            schema["properties"] = {},
            schema["type"] = "object",
            schema["attributes"] = {};

        var root = this.parseXMLTree(xsdText);

        var complexTypes = {};
        var ignoreTags = ["any", "anyAttribute", "sequence", "all", "choice", "annotation", "documentation"];
        var ignoreAttributes = ["substitutionGroups", "default", "fixed", "use", "maxOccurs", "minOccurs"];
        var namespaces = []; //the first entry is default namespace
        var schemaAttributes = root.attributes;
        var generalElements = root.children;
        var globalElements = [];


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


        //filter definitions in root
        var definitions = {};
        for (var i = 0; i < root.children.length; i++) {
            var child = root.children[i];
            if (child.attributes.name) {
                var res = traverseXSDTree(child, {});
                definitions[child.attributes.name.value] = res;
            }
            if (child.tagName === namespaces[0] + ":element") {
                globalElements.push(child);
            }
        }
        console.log(definitions);


        //set the root 
        var schemaRoot = globalElements[0];
        //        console.log(globalElements);
        if (globalElements.length > 1) {
            console.log("multiple possible roots - first possible element selected");
            //if no child elements and primary - select next
            var count = globalElements.length - 1;
            while (count >= 0) {
                schemaRoot = globalElements[count];
                if (schemaRoot.children.length !== 0 || !isPrimaryType(schemaRoot.attributes.type.value)) {
                    break;
                }
                count--;
            }
        }
        schema["title"] = schemaRoot.attributes.name.value;
        //        console.log(schemaRoot.attributes.name);

        //create schema from root


        //traverse the items and add to definitions
        function traverseXSDTree(root, result) {
            var obj = {};
            var tagName = getTagName(root.tagName);
            if (ignoreTags.indexOf(tagName) > -1 || ((tagName === "complexType" || tagName === "simpleType") && !root.attributes.length) || tagName === "restriction") { //if the tag is 
                obj = result;
            } else {
                var tempName = root.attributes.name || root.attributes.ref;
                if (tempName) {
                    var rootName = tempName.value;
                    result[rootName] = {};
                    obj = result[rootName];
                }
            }

            if (root.children.length === 0) {
                for (var j = 0; j < root.attributes.length; j++) {
                    var attr = root.attributes[j];
                    if (attr.name === "type") {
                        if (isPrimaryType(attr.value)) {
                            obj["isLeaf"] = true;
                        } else {
                            obj["isLeaf"] = false;
                        }
                        obj["type"] = getTagName(attr.value) || attr.value;
                    } else {
                        obj[attr.name] = attr.value;
                    }
                }
                if (tagName === "attribute") {
                    obj["isAttribute"] = true;
                }
                return result;
            }

            if (getTagName(root.parentElement.tagName) === "simpleType") {
                //                console.log(obj);
                obj["type"] = getTagName(root.attributes.base.value);
                obj["isLeaf"] = true;
                //                console.log(obj);
                return result;
            }

            for (var i = 0; i < root.children.length; i++) {
                var child = root.children[i];
                var res = traverseXSDTree(child, obj);
            }
            return result;
        }



        function getTagName(name) {
            var keys = name.split(":");
            if (keys.length == 2 && namespaces.indexOf(keys[0] > -1)) {
                return keys[1];
            }
        }

        function isPrimaryType(type) {
            var keys = type.split(":");
            if (keys.length == 2 && namespaces[0] === keys[0]) {
                return keys[1];
            } else {
                return false;
            }
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