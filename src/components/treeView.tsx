

import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem, {
    TreeItemProps,
    useTreeItem,
    TreeItemContentProps,
} from '@mui/lab/TreeItem';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';



interface Node {
    id: string;
    name: string;
    type : string;
    children: any;

}
interface MyTreeViewprops {
    nodes: Node;
}



const CustomContent = React.forwardRef(function CustomContent(
    props: TreeItemContentProps,
    ref,
) {
    const {
        classes,
        className,
        label,
        nodeId,
        icon: iconProp,
        expansionIcon,
        displayIcon,
    } = props;

    const {
        disabled,
        expanded,
        selected,
        focused,
        handleExpansion,
        handleSelection,
        preventSelection,
    } = useTreeItem(nodeId);

    const icon = iconProp || expansionIcon || displayIcon;

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        preventSelection(event);
    };

    const handleExpansionClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        handleExpansion(event);
    };

    const handleSelectionClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        handleSelection(event);
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            })}
            onMouseDown={handleMouseDown}
            ref={ref as React.Ref<HTMLDivElement>}
        >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div onClick={handleExpansionClick} className={classes.iconContainer}>
                {icon}
            </div>
            <Typography
                onClick={handleSelectionClick}
                component="div"
                className={classes.label}
            >
                {label}
            </Typography>
        </div>
    );
});
const CustomTreeItem = (props: TreeItemProps) => (
    <TreeItem ContentComponent={CustomContent}  {...props} />
);




export class MyTreeView extends React.PureComponent<MyTreeViewprops, {}>{

    //渲染数据
    private renderTree = (node: Node) => (
            <CustomTreeItem key={node.id} nodeId={node.id} label={node.name}>
                {Array.isArray(node["children"]) ? node["children"].map((x) => this.renderTree(x)) : null}
            </CustomTreeItem>
    );

    // public findNodeById(id:string,node:Node){
    //     if (node.id == id){
    //         return node;
    //     } 
    //     else{
    //         for(let i=0;i<node.children.length;i++){
    //             let x:any;
    //             x = this.findNodeById(id,node.children[i]);
    //             if (x!==null)return x;
    //         }
    //     }
    //     return null;
    // }


    public render() {
        return (
            <TreeView
                aria-label="icon expansion"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                // onNodeSelect={(event: object, value: string) => { console.log(this.findNodeById(value,this.props.nodes).name); }}
            >
                {this.renderTree(this.props.nodes)}
            </TreeView>

        );
    }


}