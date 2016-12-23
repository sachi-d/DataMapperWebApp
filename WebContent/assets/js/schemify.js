/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var Schemify = {

    initSchema: function () {
        var schema = {
            "$schema": "http://json-schema.org/draft-04/schema#"
        };
        return schema;
    },
    JSONtoJSONSchema: function (obj) {
        var schema = this.initSchema();
        if (Object.keys(obj).length === 1) {
            var title = Object.keys(obj)[0];
            schema.title = title;
            obj = obj[title];
        }

        var objType = typeof obj;
        schema.type = objType;
        if (objType !== "object") {
            schema.properties = {};
            return schema;

        }
        var str = Array.isArray(obj) ? "items" : "properties";
        schema[str] = {};

        (function traverse(obj, result) {
            var keys = Object.keys(obj);
            keys.map(function (key) {
                var subject = obj[key],
                    type = typeof subject;
                //if type is object or array
                if (type === "object") {
                    //if Array
                    if (Array.isArray(subject)) {
                        result[key] = {
                            "type": "array"
                        };
                        var arrayType = typeof subject[0],
                            tempObject = {
                                "items": {}
                            };
                        if (arrayType !== "object") {
                            tempObject.items.type = arrayType;
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
                } else { //if leaf type
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
        var schema = this.initSchema(),
            self = this,

            //parse XML tree
            root = this.parseXMLTree(xmlText);

        schema.title = root.tagName;
        schema.type = "object";
        schema.properties = {};
        var namespace = "";
        if (root.attributes.length > 0) {
            var obj = {};
            for (var j = 0; j < root.attributes.length; j++) {
                var attr = root.attributes[j];
                //skip xmlns stuff 
                if (!attr.name.includes("xmlns")) {
                    obj[attr.name] = {
                        "type": self.getType(attr.textContent)
                    }
                } else {
                    if (attr.value.includes("www.w3.org") && attr.name.split(":").length > 1) {
                        namespace = attr.name.split(":")[1];
                    }
                }
            }
            schema.attributes = obj;
        }
        for (var i = 0; i < root.children.length; i++) {
            traverseXMLTree(root.children[i], schema["properties"]);
        }

        function traverseXMLTree(rootNode, parent) {
            var children = rootNode.children;
            var attributes = rootNode.attributes;
            var title = rootNode.tagName;

            //check if there is xsi:type... and add attributes
            var myAttributes = {};
            if (attributes.length > 0) {
                for (var j = 0; j < attributes.length; j++) {
                    var attr = attributes[j];
                    if (!attr.name.includes("xmlns")) {

                        //if there is (xsi:type) add the value to title
                        if (attr.name === namespace + ":type") {
                            title = title + ":" + attr.value;
                        } //else {
                        myAttributes[attr.name] = {
                                "type": self.getType(attr.textContent)
                            }
                            //                        }
                    }

                }
            }


            var isArray = parent[title] ? true : false;


            if (isArray) { //if array
                parent[title]["type"] = "array";
                if (parent[title]["properties"]) {
                    parent[title]["items"] = {
                        "type": "object",
                        "properties": parent[title]["properties"],
                    }

                    delete parent[title]["properties"];
                }

                return;
            } else {
                parent[title] = {
                    "type": self.getType(rootNode.textContent)
                };
            }
            if (children.length === 0 && attributes.length === 0) {
                return;
            } else {

                //add children
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

                //add attributes
                if (attributes.length !== 0) {
                    parent[title]["attributes"] = myAttributes;
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
                definitions[child.attributes.name.value] = {};
                var res = traverseXSDTree(child, definitions[child.attributes.name.value], child.attributes.name.value);

            }
            if (child.tagName === namespaces[0] + ":element") {
                globalElements.push(child);
            }
        }
        console.log(JSON.stringify(definitions, null, 4));


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
        var rootTitle = schemaRoot.attributes.name.value;
        schema["title"] = rootTitle;
        schemaRoot = definitions[rootTitle];
        //        console.log(schemaRoot.attributes.name);

        var myCount = 0;
        //create schema from root
        createSchemaFromDefs(schemaRoot, schema);


        //create the schema using the calculated definitions
        function createSchemaFromDefs(rootObj, target) {
            for (var kk = 0; kk < Object.keys(rootObj).length; kk++) {
                var key = Object.keys(rootObj)[kk];
                var val = rootObj[key];
                if (typeof val === "object") {
                    var tempTarget = target;

                    target["properties"] = target["properties"] || {};
                    tempTarget = target["properties"];


                    if (val["isAttribute"]) { //iff attribute - change the target location
                        target["attributes"] = target["attributes"] || {};
                        tempTarget = target["attributes"];
                    }

                    if (val["type"] && definitions[val.type]) { //if the type is a definition, choose it as the subject
                        val = definitions[val.type];
                    }

                    if (val["isLeaf"]) {
                        //if a leaf node - add it to the target
                        tempTarget[key] = val;

                    } else {
                        if (val["isGroupDef"]) {
                            //if the definition is group - use the parent target (not in a new nested child)
                            tempTarget = target;
                            createSchemaFromDefs(val, tempTarget);
                        } else {
                            tempTarget[key] = {};
                            tempTarget[key]["type"] = "object";
                            createSchemaFromDefs(val, tempTarget[key]);

                        }
                    }
                } else {
                    if (key === "type" && definitions[val]) {
                        if (!definitions[val]["isLeaf"]) {
                            createSchemaFromDefs(definitions[val], target);
                        }
                    }
                }
            }
        }


        //traverse the items and add to definitions
        function traverseXSDTree(root, result, title) {
            var obj = result;
            var tagName = getTagName(root.tagName);
            if (ignoreTags.indexOf(tagName) > -1 || ((tagName === "complexType" || tagName === "simpleType") && !root.attributes.length) || tagName === "restriction") { //if the tag is 
                obj = result;
            } else {
                var tempName = root.attributes.name || root.attributes.ref;
                if (tempName) {
                    if (tagName !== "complexType" && tagName !== "simpleType") {
                        var rootName = tempName.value;
                        if (rootName !== title) {
                            result[rootName] = {};
                            obj = result[rootName];
                        }
                    } else {
                        obj = result;
                    }
                    if (tagName === "group") {
                        obj["isGroupDef"] = true;
                    }
                }
            }

            if (root.children.length === 0) {
                for (var j = 0; j < root.attributes.length; j++) {
                    var attr = root.attributes[j];
                    if (attr.name === "type") {
                        if (isPrimaryType(attr.value)) {
                            obj["isLeaf"] = true;
                        }
                        obj["type"] = getTagName(attr.value) || attr.value;
                    } else if (attr.name === "ref") {
                        obj["type"] = attr.value;
                    } else {
                        obj[attr.name] = attr.value;
                    }
                }
                if (tagName === "attribute") {
                    obj["isAttribute"] = true;
                }
                return result;
            }

            if (getTagName(root.parentElement.tagName) === "simpleType" && root.attributes.base) {
                //                console.log(obj);
                obj["type"] = getTagName(root.attributes.base.value);
                obj["isLeaf"] = true;
                //                console.log(obj);
                return result;
            }

            for (var i = 0; i < root.children.length; i++) {
                var child = root.children[i];
                var res = traverseXSDTree(child, obj, "");
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
