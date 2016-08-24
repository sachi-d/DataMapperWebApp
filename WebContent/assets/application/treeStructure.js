function setDivElement(nodeName) {
    return "<div class=\"node-element\" >" + nodeName + "</div>";
}

function setInLeaf(nodeName) {
    return " <div class=\"node-element leaf in-leaf \" > " + nodeName + "</div>";
}

function setOutLeaf(nodeName) {
    return " <div class=\"node-element leaf out-leaf \" > " + nodeName + "</div>";
}







//traverse XML tree
function traverseTree(rootNode, resultBox, level) {
    if (rootNode.nodeType !== Node.ELEMENT_NODE) {
        return;
    }
    var children = rootNode.childNodes;
    var nodeName = "";
    if (children.length === 1) {
        if (resultBox.split("-")[0] === "input") {
            nodeName = setInLeaf(rootNode.nodeName);

        } else {
            nodeName = setOutLeaf(rootNode.nodeName);
        }

    } else {
        nodeName = setDivElement(rootNode.nodeName);
    }
    var startDIV = "<div class=\"node\" >";
    var endDIV = " </div>";
    var joinBottom = "<img  src=\"assets/application/images/joinbottom.png\" >";
    var empty = "<img  src=\"assets/application/images/empty.png\" >";

    $("#" + resultBox).append(startDIV);
    for (var j = 0; j < level; j++) {
        $("#" + resultBox).append(empty);
    }
    $("#" + resultBox).append(joinBottom);
    $("#" + resultBox).append(nodeName);
    $("#" + resultBox).append(endDIV);
    for (var i = 0; i < children.length; i++) {

        var child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            traverseTree(child, resultBox, level + 1);

        }

    }
}






//parse XML tree
function parseXMLTree(inputText, resultBox) {
    $("#" + resultBox).empty();
    parser = new DOMParser();


    var xmlDoc = parser.parseFromString(inputText, "text/xml");

    // documentElement always represents the root node
    var root = xmlDoc.documentElement;
    traverseTree(root, resultBox, 0);

}