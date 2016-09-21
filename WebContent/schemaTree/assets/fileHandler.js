// get file information
function parseFile(file, container) {

    if (file.name.endsWith(".json")) {

        // display text
        if (file.type === "application/json") {

            var reader = new FileReader();
            reader.onload = function (e) {

                //parseJSON
                var text = e.target.result;

                parseJSONTree(text, container);

            };
            reader.readAsText(file);
        }

        // hide load-file div
        var elementname = container.loadfile;
        $("#"+elementname).slideUp('fast');

    }
}



// file drag hover
function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    //when a file is dragged over drag-area, change the class of the div->change css

    if (e.target.className.split("-")[1] === "drag") { //if dragged
        e.target.className = (e.type === "dragover" ? "file-drag-hover" : "file-drag");
    } else {
        e.target.className = (e.type === "dragover" ? "file-drag-hover" : "");
    }

}


// file selection
function fileSelectHandler(e, container) {

    // cancel event and hover styling
    fileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    parseFile(files[0], container);
}



// initialize
function init(container) {
 
    var fileselect = document.getElementById(container.fileselect);
    var filedrag = document.getElementById(container.filedrag);

    // file select
    fileselect.addEventListener("change", function (e) {
        fileSelectHandler(e, container)
    }, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {

        // file drop
        filedrag.addEventListener("dragover", fileDragHover, false);
        filedrag.addEventListener("dragleave", fileDragHover, false);
        filedrag.addEventListener("drop", function (e) {
            fileSelectHandler(e, container)
        }, false);
        //  filedrag.style.display = "block";

    }

}