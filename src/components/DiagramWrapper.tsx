/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import {ReactDiagram} from 'gojs-react';
import * as React from 'react';

import {GuidedDraggingTool} from '../GuidedDraggingTool';

import './Diagram.css';

interface DiagramProps {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    skipsDiagramUpdate: boolean;
    onDiagramEvent: (e: go.DiagramEvent) => void;
    onModelChange: (e: go.IncrementalData) => void;
}

export class DiagramWrapper extends React.Component<DiagramProps, {}> {
    /**
     * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
     */
    private diagramRef: React.RefObject<ReactDiagram>;

    /** @internal */
    constructor(props: DiagramProps) {
        super(props);
        this.diagramRef = React.createRef();
    }

    /**
     * Get the diagram reference and add any desired diagram listeners.
     * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
     */
    public componentDidMount() {
        if (!this.diagramRef.current) return;
        const diagram = this.diagramRef.current.getDiagram();
        if (diagram instanceof go.Diagram) {
            diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
        }
    }

    /**
     * Get the diagram reference and remove listeners that were added during mounting.
     */
    public componentWillUnmount() {
        if (!this.diagramRef.current) return;
        const diagram = this.diagramRef.current.getDiagram();
        if (diagram instanceof go.Diagram) {
            diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
        }
    }

    // public insertNode


    /**
     * Diagram initialization method, which is passed to the ReactDiagram component.
     * This method is responsible for making the diagram and initializing the model, any templates,
     * and maybe doing other initialization tasks like customizing tools.
     * The model's data should not be set here, as the ReactDiagram component handles that.
     */
    private initDiagram(): go.Diagram {
        const $ = go.GraphObject.make;
        // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
        const diagram =
            $(go.Diagram,
                {
                    'undoManager.isEnabled': true,  // must be set to allow for model change listening
                    // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
                    'clickCreatingTool.archetypeNodeData': {
                        text: 'new node',
                        color: 'lightblue'
                    },
                    draggingTool: new GuidedDraggingTool(),  // defined in GuidedDraggingTool.ts
                    'draggingTool.horizontalGuidelineColor': 'blue',
                    'draggingTool.verticalGuidelineColor': 'blue',
                    'draggingTool.centerGuidelineColor': 'green',
                    'draggingTool.guidelineWidth': 1,
                    layout: $(go.ForceDirectedLayout),
                    model: $(go.GraphLinksModel,
                        {
                            linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                            // positive keys for nodes
                            makeUniqueKeyFunction: (m: go.Model, data: any) => {
                                let k = data.key || 1;
                                while (m.findNodeDataForKey(k)) k++;
                                data.key = k;
                                return k;
                            },
                            // negative keys for links
                            makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
                                let k = data.key || -1;
                                while (m.findLinkDataForKey(k)) k--;
                                data.key = k;
                                return k;
                            },


                            linkFromPortIdProperty: "fromPort",  // required information:
                            linkToPortIdProperty: "toPort",
                        })
                });
        let portItemTemplate = () =>
            new go.Panel("Spot", {
                cursor: "pointer",
                fromSpot: go.Spot.Right,
                toSpot: go.Spot.Left,
                height:60,
                width:60,
                // background: "red",

            })
            .bind("alignment", "pos", (array) => new go.Spot(array[0], array[1]))
            .add(new go.TextBlock({
                font: '400 .875rem Roboto, sans-serif',
                // alignment: new go.Spot(1, 1, 0, -20),
                // alignmentFocus: new go.Spot(1, 0.5, 30, 0),
                // alignmentFocus:go.Spot.Top,
                // background: "white",
                textAlign: "center",
                stroke: "blue"
            }).bind('text', 'name'))
            .add(
                new go.Shape("Rectangle", {
                    desiredSize: new go.Size(7, 7),
                    fromLinkable: true,
                    toLinkable: true,
                }).bind("portId", "name")
            )



        diagram.nodeTemplate =
            new go.Node('Spot', {
                itemTemplate: portItemTemplate()
            })
            .bind(new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify))
            .bind('itemArray', 'conn')
            .add(
                new go.Panel(go.Panel.Auto, {stretch: go.GraphObject.Fill})
                .add(new go.Shape('Rectangle', {
                        name: 'SHAPE',
                        fill: 'white',
                        desiredSize: new go.Size(100, 100),
                        strokeWidth: 2,
                        stroke: 'gray',
                        // set the port properties:
                        fromLinkable: false,
                        toLinkable: false,
                    })
                )
                .add(new go.TextBlock({
                    margin: 1,
                    editable: true,
                    font: '400 .875rem Roboto, sans-serif'
                }).bind(new go.Binding('text', 'text').makeTwoWay()))
            )


        // relinking depends on modelData
        diagram.linkTemplate =
            $(go.Link,
                {routing: go.Link.Orthogonal},
                new go.Binding('relinkableFrom', 'canRelink').ofModel(),
                new go.Binding('relinkableTo', 'canRelink').ofModel(),
                $(go.Shape),
                // $(go.Shape, {toArrow: 'Standard'})
            );
        diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;

        return diagram;
    }

    public render() {
        return (
            <ReactDiagram
                ref={this.diagramRef}
                divClassName='diagram-component'
                initDiagram={this.initDiagram}
                nodeDataArray={this.props.nodeDataArray}
                linkDataArray={this.props.linkDataArray}
                modelData={this.props.modelData}
                onModelChange={this.props.onModelChange}
                skipsDiagramUpdate={this.props.skipsDiagramUpdate}
            />
        );
    }
}
