var gojs = (function () {
    "use strict";

    var myDiagram;

    function init() {
        // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
        // For details, see https://gojs.net/latest/intro/buildingObjects.html
        const $ = go.GraphObject.make; // for conciseness in defining templates
        myDiagram = new go.Diagram('myDiagramDiv', {
            allowCopy: false,
            layout: $(go.LayeredDigraphLayout, {
                setsPortSpots: false, // Links already know their fromSpot and toSpot
                columnSpacing: 5,
                isInitial: false,
                isOngoing: false,
            }),
            validCycle: go.CycleMode.NotDirected,
            'undoManager.isEnabled': true,
        });

        // when the document is modified, add a "*" to the title and enable the "Save" button
        myDiagram.addDiagramListener('Modified', (e) => {
            const button = document.getElementById('SaveButton');
            if (button) button.disabled = !myDiagram.isModified;
            const idx = document.title.indexOf('*');
            if (myDiagram.isModified) {
                if (idx < 0) document.title += '*';
            } else {
                if (idx >= 0) document.title = document.title.slice(0, idx);
            }
        });

        const graygrad = $(go.Brush, 'Linear', { 0: 'white', 0.1: 'whitesmoke', 0.9: 'whitesmoke', 1: 'lightgray' });

        myDiagram.nodeTemplate = // the default node template
            $(go.Node,
                'Spot',
                { selectionAdorned: false, textEditable: true, locationObjectName: 'BODY' },
                new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                // the main body consists of a Rectangle surrounding the text
                $(go.Panel,
                    'Auto',
                    { name: 'BODY' },
                    $(go.Shape,
                        'Rectangle',
                        { fill: graygrad, stroke: 'gray', minSize: new go.Size(120, 21) },
                        new go.Binding('fill', 'isSelected', (s) => (s ? 'dodgerblue' : graygrad)).ofObject()
                    ),
                    $(go.TextBlock,
                        {
                            stroke: 'black',
                            font: '12px sans-serif',
                            editable: true,
                            margin: new go.Margin(3, 3 + 11, 3, 3 + 4),
                            alignment: go.Spot.Left,
                        },
                        new go.Binding('text').makeTwoWay()
                    )
                ),
                // output port
                $(go.Panel,
                    'Auto',
                    { alignment: go.Spot.Right, portId: 'from', fromLinkable: true, cursor: 'pointer', click: (e, obj) => {
                            if (obj.part.data.category !== 'NoAdd') {
                                addNodeAndLink(e, obj);
                            }
                        }},
                    $(go.Shape, 'Diamond', { width: 11, height: 11, fill: 'white', stroke: 'dodgerblue', strokeWidth: 3 }),
                    $(go.Shape, 'PlusLine', new go.Binding('visible', '', (data) => data.category !== 'NoAdd').ofObject(), { width: 11, height: 11, fill: null, stroke: 'dodgerblue', strokeWidth: 3 })
                ),
                // input port
                $(go.Panel,
                    'Auto',
                    { alignment: go.Spot.Left, portId: 'to', toLinkable: true },
                    $(go.Shape, 'Circle', { width: 8, height: 8, fill: 'white', stroke: 'gray' }),
                    $(go.Shape, 'Circle', { width: 4, height: 4, fill: 'dodgerblue', stroke: null })
                )
            );

        myDiagram.nodeTemplate.contextMenu = $('ContextMenu',
            $('ContextMenuButton',
                $(go.TextBlock, 'Rename'),
                { click: (e, obj) => e.diagram.commandHandler.editTextBlock() },
                new go.Binding('visible', '', (o) => o.diagram && o.diagram.commandHandler.canEditTextBlock()).ofObject()
            ),
            // add one for Editing...
            $('ContextMenuButton',
                $(go.TextBlock, 'Delete'),
                { click: (e, obj) => e.diagram.commandHandler.deleteSelection() },
                new go.Binding('visible', '', (o) => o.diagram && o.diagram.commandHandler.canDeleteSelection()).ofObject()
            )
        );

        myDiagram.nodeTemplateMap.add(
            'Loading',
            $(go.Node,
                'Spot',
                { selectionAdorned: false, textEditable: true, locationObjectName: 'BODY' },
                new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                // the main body consists of a Rectangle surrounding the text
                $(go.Panel,
                    'Auto',
                    { name: 'BODY' },
                    $(go.Shape,
                        'Rectangle',
                        { fill: graygrad, stroke: 'gray', minSize: new go.Size(120, 21) },
                        new go.Binding('fill', 'isSelected', (s) => (s ? 'dodgerblue' : graygrad)).ofObject()
                    ),
                    $(go.TextBlock,
                        {
                            stroke: 'black',
                            font: '12px sans-serif',
                            editable: true,
                            margin: new go.Margin(3, 3 + 11, 3, 3 + 4),
                            alignment: go.Spot.Left,
                        },
                        new go.Binding('text', 'text')
                    )
                ),
                // output port
                $(go.Panel,
                    'Auto',
                    { alignment: go.Spot.Right, portId: 'from', fromLinkable: true, click: addNodeAndLink },
                    $(go.Shape, 'Circle', { width: 22, height: 22, fill: 'white', stroke: 'dodgerblue', strokeWidth: 3 }),
                    $(go.Shape, 'PlusLine', { width: 11, height: 11, fill: null, stroke: 'dodgerblue', strokeWidth: 3 })
                )
            )
        );

        myDiagram.nodeTemplateMap.add(
            'End',
            $(go.Node,
                'Spot',
                { selectionAdorned: false, textEditable: true, locationObjectName: 'BODY' },
                new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                // the main body consists of a Rectangle surrounding the text
                $(go.Panel,
                    'Auto',
                    { name: 'BODY' },
                    $(go.Shape,
                        'Rectangle',
                        { fill: graygrad, stroke: 'gray', minSize: new go.Size(120, 21) },
                        new go.Binding('fill', 'isSelected', (s) => (s ? 'dodgerblue' : graygrad)).ofObject()
                    ),
                    $(go.TextBlock,
                        {
                            stroke: 'black',
                            font: '12px sans-serif',
                            editable: true,
                            margin: new go.Margin(3, 3 + 11, 3, 3 + 4),
                            alignment: go.Spot.Left,
                        },
                        new go.Binding('text', 'text')
                    )
                ),
                // input port
                $(go.Panel,
                    'Auto',
                    { alignment: go.Spot.Left, portId: 'to', toLinkable: true },
                    $(go.Shape, 'Circle', { width: 8, height: 8, fill: 'white', stroke: 'gray' }),
                    $(go.Shape, 'Circle', { width: 4, height: 4, fill: 'dodgerblue', stroke: null })
                )
            )
        );

        // dropping a node on this special node will cause the selection to be deleted;
        // linking or relinking to this special node will cause the link to be deleted
        myDiagram.nodeTemplateMap.add(
            'Recycle',
            $(go.Node,
                'Auto',
                {
                    portId: 'to',
                    toLinkable: true,
                    deletable: false,
                    layerName: 'Background',
                    locationSpot: go.Spot.Center,
                },
                new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                {
                    dragComputation: (node, pt, gridpt) => pt,
                    mouseDrop: (e, obj) => e.diagram.commandHandler.deleteSelection(),
                },
                $(go.Shape, { fill: 'lightgray', stroke: 'gray' }),
                $(go.TextBlock, 'Drop Here\nTo Delete', { margin: 5, textAlign: 'center' })
            )
        );

        // this is a click event handler that adds a node and a link to the diagram,
        // connecting with the node on which the click occurred
        function addNodeAndLink(e, obj) {
            const fromNode = obj.part;
            const diagram = fromNode.diagram;
            diagram.startTransaction('Add State');
            // get the node data for which the user clicked the button
            const fromData = fromNode.data;
            const category = fromData.category;
            const c_id = fromData.c_id;
            alert(c_id);

            if (category === 'NoAdd') {
                // 중간 노드의 경우 ALM 상태의 Node는 생성 못하도록 처리
                diagram.commitTransaction('Add Node');
                return;
            }

            // create a new "State" data object, positioned off to the right of the fromNode
            const p = fromNode.location.copy();
            p.x += diagram.toolManager.draggingTool.gridSnapCellSize.width;
            const toData = {
                text: 'new',
                loc: go.Point.stringify(p),
            };
            // add the new node data to the model
            const model = diagram.model;
            model.addNodeData(toData);
            // create a link data from the old node data to the new node data
            const linkdata = {
                from: model.getKeyForNodeData(fromData),
                to: model.getKeyForNodeData(toData),
            };
            // and add the link data to the model
            model.addLinkData(linkdata);
            // select the new Node
            const newnode = diagram.findNodeForData(toData);
            diagram.select(newnode);
            // snap the new node to a valid location
            newnode.location = diagram.toolManager.draggingTool.computeMove(newnode, p);
            // then account for any overlap
            shiftNodesToEmptySpaces();
            diagram.commitTransaction('Add State');
        }

        // Highlight ports when they are targets for linking or relinking.
        let OldTarget = null; // remember the last highlit port
        function highlight(port) {
            if (OldTarget !== port) {
                lowlight(); // remove highlight from any old port
                OldTarget = port;
                port.scale = 1.3; // highlight by enlarging
            }
        }
        function lowlight() {
            // remove any highlight
            if (OldTarget) {
                OldTarget.scale = 1.0;
                OldTarget = null;
            }
        }

        // Connecting a link with the Recycle node removes the link
        myDiagram.addDiagramListener('LinkDrawn', (e) => {
            const link = e.subject;
            const fromNode = link.fromNode;
            const toNode = link.toNode;

            if (fromNode.category === 'NoAdd' && fromNode.findLinksOutOf().count > 1) {
                myDiagram.remove(link);
            }

            if (toNode.category === 'NoAdd' && toNode.findLinksInto().count > 1) {
                myDiagram.remove(link);
            }

            if (toNode.category === 'End' && toNode.findLinksInto().count > 1) {
                myDiagram.remove(link);
            }

            if (fromNode.category === 'Loading' && toNode.category === "End") {
                myDiagram.remove(link);
            }

            lowlight();
        });
        myDiagram.addDiagramListener('LinkRelinked', (e) => {
            console.log(e);
            const link = e.subject;
            const fromNode = link.fromNode;
            const toNode = link.toNode;

            if (fromNode.category === 'NoAdd' && fromNode.findLinksOutOf().count > 1) {
                myDiagram.remove(link);
            }

            if (toNode.category === 'NoAdd' && toNode.findLinksInto().count > 1) {
                myDiagram.remove(link);
            }

            if (toNode.category === 'End' && toNode.findLinksInto().count > 1) {
                myDiagram.remove(link);
            }

            if (fromNode.category === 'Loading' && toNode.category === "End") {
                myDiagram.remove(link);
            }
        });

        myDiagram.linkTemplate = $(go.Link,
            { selectionAdorned: false, fromPortId: 'from', toPortId: 'to', relinkableTo: true },
            $(go.Shape,
                { stroke: 'gray', strokeWidth: 2 },
                {
                    mouseEnter: (e, obj) => {
                        obj.strokeWidth = 5;
                        obj.stroke = 'dodgerblue';
                    },
                    mouseLeave: (e, obj) => {
                        obj.strokeWidth = 2;
                        obj.stroke = 'gray';
                    },
                }
            )
        );

        function commonLinkingToolInit(tool) {
            // the temporary link drawn during a link drawing operation (LinkingTool) is thick and blue
            tool.temporaryLink = $(go.Link, { layerName: 'Tool' }, $(go.Shape, { stroke: 'dodgerblue', strokeWidth: 5 }));

            // change the standard proposed ports feedback from blue rectangles to transparent circles
            tool.temporaryFromPort.figure = 'Circle';
            tool.temporaryFromPort.stroke = null;
            tool.temporaryFromPort.strokeWidth = 0;
            tool.temporaryToPort.figure = 'Circle';
            tool.temporaryToPort.stroke = null;
            tool.temporaryToPort.strokeWidth = 0;

            // provide customized visual feedback as ports are targeted or not
            tool.portTargeted = (realnode, realport, tempnode, tempport, toend) => {
                if (realport === null) {
                    // no valid port nearby
                    lowlight();
                } else if (toend) {
                    highlight(realport);
                }
            };
        }

        const ltool = myDiagram.toolManager.linkingTool;
        commonLinkingToolInit(ltool);
        // do not allow links to be drawn starting at the "to" port
        ltool.direction = go.LinkingDirection.ForwardsOnly;

        const rtool = myDiagram.toolManager.relinkingTool;
        commonLinkingToolInit(rtool);
        // change the standard relink handle to be a shape that takes the shape of the link
        rtool.toHandleArchetype = $(go.Shape, { isPanelMain: true, fill: null, stroke: 'dodgerblue', strokeWidth: 5 });

        // use a special DraggingTool to cause the dragging of a Link to start relinking it
        myDiagram.toolManager.draggingTool = new DragLinkingTool();

        // detect when dropped onto an occupied cell
        myDiagram.addDiagramListener('SelectionMoved', shiftNodesToEmptySpaces);

        function shiftNodesToEmptySpaces() {
            myDiagram.selection.each((node) => {
                if (!(node instanceof go.Node)) return;
                // look for Parts overlapping the node
                while (true) {
                    const exist = myDiagram
                        .findObjectsIn(
                            node.actualBounds,
                            // only consider Parts
                            (obj) => obj.part,
                            // ignore Links and the dropped node itself
                            (part) => part instanceof go.Node && part !== node,
                            // check for any overlap, not complete containment
                            true
                        )
                        .first();
                    if (exist === null) break;
                    // try shifting down beyond the existing node to see if there's empty space
                    node.moveTo(node.actualBounds.x, exist.actualBounds.bottom + 10);
                }
            });
        }

        // prevent nodes from being dragged to the left of where the layout placed them
        myDiagram.addDiagramListener('LayoutCompleted', (e) => {
            myDiagram.nodes.each((node) => {
                if (node.category === 'Recycle') return;
                node.minLocation = new go.Point(node.location.x, -Infinity);
            });
        });

        // load(); // load initial diagram from the mySavedModel textarea
    }

    function save() {
        let data = myDiagram.model.toJson();
        console.log(data);

        document.getElementById('mySavedModel').value = myDiagram.model.toJson();
        myDiagram.isModified = false;
    }

    function load(data) {

        // let data = document.getElementById('mySavedModel').value;
        console.log(data);

        myDiagram.model = go.Model.fromJson(data);
        // if any nodes don't have a real location, explicitly do a layout
        if (myDiagram.nodes.any((n) => !n.location.isReal())) layout();
    }

    function layout() {
        myDiagram.layoutDiagram(true);
    }

    // Define a custom tool that changes a drag operation on a Link to a relinking operation,
    // but that operates like a normal DraggingTool otherwise.
    class DragLinkingTool extends go.DraggingTool {
        constructor() {
            super();
            this.isGridSnapEnabled = true;
            this.isGridSnapRealtime = false;
            this.gridSnapCellSize = new go.Size(182, 1);
            this.gridSnapOrigin = new go.Point(5.5, 0);
        }

        // Handle dragging a link specially -- by starting the RelinkingTool on that Link
        doActivate() {
            const diagram = this.diagram;
            if (diagram === null) return;
            this.standardMouseSelect();
            const main = this.currentPart; // this is set by the standardMouseSelect
            if (main instanceof go.Link) {
                // maybe start relinking instead of dragging
                const relinkingtool = diagram.toolManager.relinkingTool;
                // tell the RelinkingTool to work on this Link, not what is under the mouse
                relinkingtool.originalLink = main;
                // start the RelinkingTool
                diagram.currentTool = relinkingtool;
                // can activate it right now, because it already has the originalLink to reconnect
                relinkingtool.doActivate();
                relinkingtool.doMouseMove();
            } else {
                super.doActivate();
            }
        }
    }
    // end DragLinkingTool

    return {
        init, save, load, layout
    }

})(); //즉시실행 함수