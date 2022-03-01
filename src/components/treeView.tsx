


import * as React from 'react';
import { TreeItem, TreeView } from '@mui/lab'


interface treeViewProps {
    treeDataJson: Array<object>;
}


[{ id: "0", name: "n0", children: [{ id: "00", name: "n00" }, { id: "01", name: "n01" }] },
{ id: "1", name: "n1" },
{ id: "2", name: "n2" }
]

export class treeView extends React.PureComponent<treeViewProps, {}>{
    private renderObjectDetails(treeDataJson: Array<object>) {
        if (treeDataJson === null) {
            return;
        }

        const dets = [];
        for (let i = 0; i < treeDataJson.length; i++) {
            var row = <TreeItem nodeId="1" label="Applications">{this.renderObjectDetails(treeDataJson[i]["children"])}</TreeItem>
            dets.push(row);
        }

        return dets;
    }



    public render() {
        return (
            <TreeView
                aria-label="file system navigator"
                sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                {this.renderObjectDetails(this.props.treeDataJson)}

            </TreeView>
        );
    }


}