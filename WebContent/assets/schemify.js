var Schemify = {
    JSONtoSchema: function (obj) {
        var objType = typeof obj;
        var schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": objType
        };
        if (objType !== "object") {
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
    }
}