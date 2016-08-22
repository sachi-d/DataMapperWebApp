function drawEndPoints(classname, endpointposition) {

    var endpointOptions = {
        isSource: true,
        isTarget: true,
        endpoint: ["Image", {
            src: "assets/application/images/arrow-head.png",
            cssClass: "leaf-endpoint"
                }],
        style: {
            fillStyle: 'blue'

        },
        maxConnections: -1,
        connector: "Straight",
        connectorStyle: {
            lineWidth: 2,
            strokeStyle: 'black'
        },
        //        connectorOverlays: [
        //    ["Arrow", {
        //                width: 10,
        //                length: 30,
        //                location: 1,
        //                id: "arrow"
        //            }]
        //  ],
        scope: "blackline",
        dropOptions: {
            drop: function (e, ui) {
                alert('drop!');
            }
        }
    };

    jsPlumb.addEndpoint($("." + classname), {
        anchor: endpointposition
    }, endpointOptions);
    jsPlumb.repaintEverything();
}