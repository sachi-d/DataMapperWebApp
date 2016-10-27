
//traverse XML tree
function traverseTree(rootNode, resultBox, level) {
    if (rootNode.nodeType !== Node.ELEMENT_NODE) {
        return;
    }
    var children = rootNode.childNodes;
 
    
    var node=d3.select("div#"+resultBox).append("div").attr("class","node");
    
    

    for (var j = 0; j < level; j++) {
        node.append("img").attr("src","../assets/application/images/empty.png");
    }
    node.append("img").attr("src","../assets/application/images/joinbottom.png");
    
    
      if (children.length === 1) {
        if (resultBox.split("-")[0] === "input") {
            node.append("div").attr("class","leaf node-element").text(rootNode.nodeName);

        } else {
            node.append("div").attr("class","leaf node-element").text(rootNode.nodeName);
        }

    } else {
        node.append("div").attr("class","node-element").text(rootNode.nodeName);
    }
    
    
    for (var i = 0; i < children.length; i++) {

        var child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            traverseTree(child, resultBox, level + 1);

        }

    }
}






//parse XML tree
function parseXMLTree(inputText, resultBox) {
//    $("#" + resultBox).empty();
    d3.select("div#"+resultBox).selectAll("div.node").remove();
    parser = new DOMParser();


    var xmlDoc = parser.parseFromString(inputText, "text/xml");

    // documentElement always represents the root node
    var root = xmlDoc.documentElement;
    traverseTree(root, resultBox, 0);

}

