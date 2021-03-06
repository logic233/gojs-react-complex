/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import {produce} from 'immer';
import * as React from 'react';
import 'antd/dist/antd.css';

import {DiagramWrapper} from './components/DiagramWrapper';
import {SelectionInspector} from './components/SelectionInspector';
import {ParaInspector} from './components/DataInspector'

import {MyTreeView} from './components/treeView'
import './App.css';
import {ConnectorInspector} from "./components/ConnectorInspector";
import Uploady from "@rpldy/uploady";
import {Layout, Menu, Breadcrumb} from 'antd';
import {log} from "util";

// import UploadDropZone from "@rpldy/upload-drop-zone";


/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
interface AppState {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    selectedData: go.ObjectData | null;
    skipsDiagramUpdate: boolean;
}


interface AppProps {
    GoJSmodel: any;
    treeInfo: any;
    ModelicaModelItem: Array<any>;
    setProjectInfoHandler: (Info: any) => void;

}


class ProjectSever extends React.Component<AppProps, AppState> {
    // Maps to store key -> arr index for quick lookups
    private mapNodeKeyIdx: Map<go.Key, number>;
    private mapLinkKeyIdx: Map<go.Key, number>;

    constructor(props: AppProps) {
        super(props);
        this.state = {
            nodeDataArray: props.GoJSmodel["node"],
            linkDataArray: props.GoJSmodel["link"],
            modelData: {
                canRelink: true
            },
            selectedData: null,
            skipsDiagramUpdate: false
        };
        // init maps
        this.mapNodeKeyIdx = new Map<go.Key, number>();
        this.mapLinkKeyIdx = new Map<go.Key, number>();
        this.refreshNodeIndex(this.state.nodeDataArray);
        this.refreshLinkIndex(this.state.linkDataArray);
        // bind handler methods
        this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRelinkChange = this.handleRelinkChange.bind(this);

    }



    /**
     * Update map of node keys to their index in the array.
     */
    private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
        this.mapNodeKeyIdx.clear();
        nodeArr.forEach((n: go.ObjectData, idx: number) => {
            this.mapNodeKeyIdx.set(n.key, idx);
        });
    }

    /**
     * Update map of link keys to their index in the array.
     */
    private refreshLinkIndex(linkArr: Array<go.ObjectData>) {
        this.mapLinkKeyIdx.clear();
        linkArr.forEach((l: go.ObjectData, idx: number) => {
            this.mapLinkKeyIdx.set(l.key, idx);
        });
    }

    /**
     * Handle any relevant DiagramEvents, in this case just selection changes.
     * On ChangedSelection, find the corresponding data and set the selectedData state.
     * @param e a GoJS DiagramEvent
     */
    public handleDiagramEvent(e: go.DiagramEvent) {
        const name = e.name;
        switch (name) {
            case 'ChangedSelection': {
                const sel = e.subject.first();
                this.setState(
                    produce((draft: AppState) => {
                        if (sel) {
                            if (sel instanceof go.Node) {
                                const idx = this.mapNodeKeyIdx.get(sel.key);
                                if (idx !== undefined && idx >= 0) {
                                    const nd = draft.nodeDataArray[idx];
                                    draft.selectedData = nd;
                                }
                            } else if (sel instanceof go.Link) {
                                const idx = this.mapLinkKeyIdx.get(sel.key);
                                if (idx !== undefined && idx >= 0) {
                                    const ld = draft.linkDataArray[idx];
                                    draft.selectedData = ld;
                                }
                            }
                        } else {
                            draft.selectedData = null;
                        }
                    })
                );
                break;
            }
            default:
                break;
        }
    }

    /**
     * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
     * This method iterates over those changes and updates state to keep in sync with the GoJS model.
     * @param obj a JSON-formatted string
     */
    public handleModelChange(obj: go.IncrementalData) {
        const insertedNodeKeys = obj.insertedNodeKeys;
        const modifiedNodeData = obj.modifiedNodeData;
        const removedNodeKeys = obj.removedNodeKeys;
        const insertedLinkKeys = obj.insertedLinkKeys;
        const modifiedLinkData = obj.modifiedLinkData;
        const removedLinkKeys = obj.removedLinkKeys;
        const modifiedModelData = obj.modelData;

        // maintain maps of modified data so insertions don't need slow lookups
        const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
        const modifiedLinkMap = new Map<go.Key, go.ObjectData>();
        this.setState(
            produce((draft: AppState) => {
                let narr = draft.nodeDataArray;
                if (modifiedNodeData) {
                    modifiedNodeData.forEach((nd: go.ObjectData) => {
                        modifiedNodeMap.set(nd.key, nd);
                        const idx = this.mapNodeKeyIdx.get(nd.key);
                        if (idx !== undefined && idx >= 0) {
                            narr[idx] = nd;
                            if (draft.selectedData && draft.selectedData.key === nd.key) {
                                draft.selectedData = nd;
                            }
                        }
                    });
                }
                if (insertedNodeKeys) {
                    insertedNodeKeys.forEach((key: go.Key) => {
                        const nd = modifiedNodeMap.get(key);
                        const idx = this.mapNodeKeyIdx.get(key);
                        if (nd && idx === undefined) {  // nodes won't be added if they already exist
                            this.mapNodeKeyIdx.set(nd.key, narr.length);
                            narr.push(nd);
                        }
                    });
                }
                if (removedNodeKeys) {
                    narr = narr.filter((nd: go.ObjectData) => {
                        if (removedNodeKeys.includes(nd.key)) {
                            return false;
                        }
                        return true;
                    });
                    draft.nodeDataArray = narr;
                    this.refreshNodeIndex(narr);
                }

                let larr = draft.linkDataArray;
                if (modifiedLinkData) {
                    modifiedLinkData.forEach((ld: go.ObjectData) => {
                        modifiedLinkMap.set(ld.key, ld);
                        const idx = this.mapLinkKeyIdx.get(ld.key);
                        if (idx !== undefined && idx >= 0) {
                            larr[idx] = ld;
                            if (draft.selectedData && draft.selectedData.key === ld.key) {
                                draft.selectedData = ld;
                            }
                        }
                    });
                }
                if (insertedLinkKeys) {
                    insertedLinkKeys.forEach((key: go.Key) => {
                        const ld = modifiedLinkMap.get(key);
                        const idx = this.mapLinkKeyIdx.get(key);
                        if (ld && idx === undefined) {  // links won't be added if they already exist
                            this.mapLinkKeyIdx.set(ld.key, larr.length);
                            larr.push(ld);
                        }
                    });
                }
                if (removedLinkKeys) {
                    larr = larr.filter((ld: go.ObjectData) => {
                        if (removedLinkKeys.includes(ld.key)) {
                            return false;
                        }
                        return true;
                    });
                    draft.linkDataArray = larr;
                    this.refreshLinkIndex(larr);
                }
                // handle model data changes, for now just replacing with the supplied object
                if (modifiedModelData) {
                    draft.modelData = modifiedModelData;
                }
                draft.skipsDiagramUpdate = true;  // the GoJS model already knows about these updates
            })
        );
    }

    /**
     * Handle inspector changes, and on input field blurs, update node/link data state.
     * @param path the path to the property being modified
     * @param value the new value of that property
     * @param isBlur whether the input event was a blur, indicating the edit is complete
     */
    public handleInputChange(path: string, value: string, isBlur: boolean) {
        this.setState(
            produce((draft: AppState) => {
                const data = draft.selectedData as go.ObjectData;  // only reached if selectedData isn't null
                data[path] = value;
                if (isBlur) {
                    const key = data.key;
                    if (key < 0) {  // negative keys are links
                        const idx = this.mapLinkKeyIdx.get(key);
                        if (idx !== undefined && idx >= 0) {
                            draft.linkDataArray[idx] = data;
                            draft.skipsDiagramUpdate = false;
                        }
                    } else {
                        const idx = this.mapNodeKeyIdx.get(key);
                        if (idx !== undefined && idx >= 0) {
                            draft.nodeDataArray[idx] = data;
                            draft.skipsDiagramUpdate = false;
                        }
                    }
                }
            })
        );
    }

    /**
     * Handle changes to the checkbox on whether to allow relinking.
     * @param e a change event from the checkbox
     */
    public handleRelinkChange(e: any) {
        const target = e.target;
        const value = target.checked;
        this.setState({
            modelData: {canRelink: value},
            skipsDiagramUpdate: false
        });
    }

//??????completeName ???ModelicaModelItem???para?????????
    private getInfoFromItem(modelicaName: string, key: string) {
        let Info;
        this.props.ModelicaModelItem.forEach(x => {
            if (x["completeName"] === modelicaName) Info = x[key];
        })
        return Info;
    }
    private getInfoFromNameSimple(name: string, key: string) {
        let Info;
        this.props.ModelicaModelItem.forEach(x => {
            if (x["name"] === name) Info = x[key];
        })
        return Info;
    }

    public handleParaValue(nodeKey: any, paraKey: string, paraValue: string) {
        //ATTENTION! ???state???????????????????????????????????????????????????
        let newNodeData = JSON.parse(JSON.stringify(this.state.nodeDataArray));
        for (const i in newNodeData) {
            if (newNodeData[i]["key"] === nodeKey) {
                newNodeData[i]["parameterValues"][paraKey] = Number(paraValue);
            }
        }
        this.setState({nodeDataArray: newNodeData});
        console.log("paraV has change", newNodeData);
    }

    public handleConnValue(linkKey: any, connType: string, connName: string) {
        //ATTENTION! ???state???????????????????????????????????????????????????
        let newLinkData = JSON.parse(JSON.stringify(this.state.linkDataArray));
        for (const i in newLinkData) {
            if (newLinkData[i]["key"] === linkKey) {
                newLinkData[i][connType] = connName;
            }
        }
        this.setState({linkDataArray: newLinkData});
        console.log("CONN has change", newLinkData);
    }

    private isSelectNode = () => {
        return this.state.selectedData!.from === undefined;
    }
    private pic2text = () => {
        let modelicaText = "model modelName\n"
        this.state.nodeDataArray.forEach(
            (item, index) => {
//work with para firstly
                let paraStr = "",
                    paraList = item['parameterValues'],
                    paraKeyList = Object.keys(paraList);
                if (paraKeyList.length) {
                    paraStr += '('
                    paraKeyList.forEach(
                        (key, index) => {
                            paraStr += key + ' = ' + paraList[key];
                            if (index !== paraKeyList.length - 1)
                                paraStr += ','
                        }
                    )
                    paraStr += ')'
                }
                let line = item['modelicaName'] + " " + item['text'] + paraStr;
                modelicaText += line + ";\n";
            }
        )
        modelicaText += 'equation\n'
        this.state.linkDataArray.forEach(
            (item) => {
                let fromName = this.findNodeByKey(item["from"])['text'];
                let toName = this.findNodeByKey(item["to"])['text'];
                modelicaText += 'connect(' + fromName + '.' + item['fromPort'] + ',' + toName + '.' + item['toPort'] + ');\n';
            }
        )
        modelicaText += 'end modelName;\n'
        alert(modelicaText);
    };

    private findNodeByKey(key: any) {
        let ans: any;
        this.state.nodeDataArray.forEach(
            (item) => {
                if (item.key === key) {
                    ans = item;
                    return;
                }
            }
        )
        return ans;
    }

    private addNode= (modelicaName:string)=> {
        let index = 0;
        let loc ;

        this.state.nodeDataArray.forEach((item) => {
            index = Math.max(item["key"],index);
            loc = item["loc"];
        })
        let nodeArr = JSON.parse(JSON.stringify(this.state.nodeDataArray));
        let connList = this.getInfoFromNameSimple(modelicaName,"conn");
        let connList_simple =new Array();
        //@ts-ignore
        connList.map((item:any)=>{
            connList_simple.push({name:item["name"],pos:item["pos"]})
        })
        let nodeNew = {key:index+1,
            loc:loc,
            text:modelicaName+(index+1),
            conn:connList_simple,
            modelicaName:this.getInfoFromNameSimple(modelicaName,"completeName"),
            parameterValues:{}
        }
        nodeArr.push(nodeNew);
        console.log("###has add",nodeArr);
        this.setState({nodeDataArray:nodeArr});
    }


    public render() {
        const selectedData = this.state.selectedData;
        let inspector, inspector_data, inspector_connector;
        console.log("selectedData", selectedData);
        console.log("allNode",this.state.nodeDataArray);
        if (selectedData !== null) {

            inspector = <SelectionInspector
                selectedData={this.state.selectedData}
                onInputChange={this.handleInputChange}
            />;
            if (this.isSelectNode()) {
                inspector_data = <ParaInspector
                    selectedData={this.state.selectedData}
                    paraInfo={this.getInfoFromItem(this.state.selectedData!["modelicaName"], "para")}
                    handleParaValue={(nodeKey: any, paraKey: string, paraValue: string) => this.handleParaValue(nodeKey, paraKey, paraValue)}
                />;

                inspector_connector =
                    <ConnectorInspector selectedData={this.state.selectedData}
                                        connectorInfo={this.getInfoFromItem(this.state.selectedData!["modelicaName"], "conn")}
                    />
            }

        }
        // let myTree = <MyTreeView nodes={nodes}/>;
        const {Header, Content, Sider} = Layout;

        return (
            <Layout>
                <Layout>
                    <Sider width={300} className="site-layout-background"
                           theme="light">
                        <MyTreeView nodes={this.props.treeInfo}
                                    addNodeHandler={this.addNode}
                        />
                    </Sider>
                    <Layout
                        style={{
                            padding: '0 24px 24px',
                        }}
                    >

                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >


                            <DiagramWrapper
                                nodeDataArray={this.state.nodeDataArray}
                                linkDataArray={this.state.linkDataArray}
                                modelData={this.state.modelData}
                                skipsDiagramUpdate={this.state.skipsDiagramUpdate}
                                onDiagramEvent={this.handleDiagramEvent}
                                onModelChange={this.handleModelChange}
                            />
                            <br/>
                            <button onClick={()=>console.log("nodeDataArray:",this.state.nodeDataArray)}>
                                show nodeDataArray
                            </button>
                            <button onClick={() => {
                                let Info = {};
                                Info["node"] = this.state.nodeDataArray;
                                Info["link"] = this.state.linkDataArray;
                                this.props.setProjectInfoHandler(Info);
                            }}>
                                save
                            </button>
                            <button onClick={this.pic2text}>
                                import as Modelica
                            </button>

                            {inspector_data}
                            {inspector_connector}
                            {inspector}


                        </Content>
                    </Layout>
                </Layout>
            </Layout>

        );
    }
}

export default ProjectSever;
