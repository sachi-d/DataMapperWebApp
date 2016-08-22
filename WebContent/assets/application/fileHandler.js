function setDivElement(nodeName) {
    return "<div class=\"node\">" + nodeName + "</div>";
}

function setInLeaf(nodeName) {
    return "<div class=\"node leaf\"> <div class=\"in-leaf \" id=\" " + nodeName + " \"> -" + nodeName + "</div></div>";
}

function setOutLeaf(nodeName) {
    return "<div class=\"node leaf\"> <div class=\"out-leaf \" id=\" " + nodeName + " \"> -" + nodeName + "</div></div>";
}

//traverse XML tree
function traverseTree(rootNode, resultBox) {
    if (rootNode.nodeType !== Node.ELEMENT_NODE) {
        return;
    }
    var children = rootNode.childNodes;
    var nodeName = "";
    if (children.length == 1) {
        if (resultBox.split("-")[0] == "input") {
            nodeName = setInLeaf(rootNode.nodeName);
            $("#" + resultBox).append(nodeName);
            drawEndPoints("in-leaf", "Right");
        } else {
            nodeName = setOutLeaf(rootNode.nodeName);
            $("#" + resultBox).append(nodeName);
            drawEndPoints("out-leaf", "Left");
        }

    } else {
        nodeName = setDivElement(rootNode.nodeName);
        $("#" + resultBox).append(nodeName);
    }

    jsPlumb.repaintEverything();

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        traverseTree(child, resultBox);
        if (child.nodeType == Node.ELEMENT_NODE && child.childNodes.length != 1) {
            break;
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
    traverseTree(root, resultBox);

}


// get file information
function parseFile(file, resultpane) {
    var fileContentPane = resultpane.split("-")[0] + "-file-content";
    if (file.name.endsWith(".xml")) {
        var res = "<p>File name: <strong>" + file.name + "</strong><br> type: <strong>" + file.type + "</strong><br> size: <strong>" + file.size + "</strong> bytes</p>";
        $("#" + fileContentPane).append(res);

        // display text
        if (file.type.indexOf("text") == 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var restxt = "<p><strong>File content:</strong></p><pre>" + e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</pre>";
                $("#" + fileContentPane).append(restxt);


                //parseXML
                var text = e.target.result;
                parseXMLTree(text, resultpane);
                //                    LoadXMLString(resultpane, text);



            }
            reader.readAsText(file);
        }

        // hide load-file div
        var elementname = "#load-" + resultpane.split("-")[0];
        $(elementname).slideUp();
    }


}

// file drag hover
function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    //when a file is dragged over drag-area, change the class of the div->change css
    e.target.className = (e.type == "dragover" ? "file-drag-hover" : "file-drag");
}


// file selection
function fileSelectHandler(e, result) {

    // cancel event and hover styling
    fileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    parseFile(files[0], result);
    drawEndPoints();
}

// initialize
function init(select, drag, result) {

    var fileselect = document.getElementById(select);
    var filedrag = document.getElementById(drag);

    // file select
    fileselect.addEventListener("change", function (e) {
        fileSelectHandler(e, result)
    }, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {

        // file drop
        filedrag.addEventListener("dragover", fileDragHover, false);
        filedrag.addEventListener("dragleave", fileDragHover, false);
        filedrag.addEventListener("drop", function (e) {
            fileSelectHandler(e, result)
        }, false);
        filedrag.style.display = "block";

    }

}