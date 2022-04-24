import * as React from 'react';
import {Tree} from 'antd';




interface MyTreeViewprops {
    nodes: any;
    addNodeHandler : (modelicaName:string)=>void;
}


export class MyTreeView extends React.PureComponent<MyTreeViewprops, {}> {
    public render() {
        console.log(this.props.nodes)
        let config = {"title": "name","key":"name"}
        return (
            <Tree
                fieldNames={config}
                // @ts-ignore
                treeData={this.props.nodes[0]}
                height={400}
                onRightClick ={(info:any)=>{
                        if(info.node.type === "model"){
                            console.log('Trigger Select',info);
                            this.props.addNodeHandler(info.node.name);
                        }
                }}


            />

        );


    }

};
