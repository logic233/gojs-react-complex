/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/


import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import './App.css';

import ProjectSever from './App'
import {Breadcrumbs} from "@mui/material";
import IconBreadcrumbs from "./components/BreadCrumb";

// import UploadDropZone from "@rpldy/upload-drop-zone";


/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
interface AppState {
    isShowList: boolean;
    editPojectId: number;
}


interface AppProps {

}


class ProjectManager extends React.Component<AppProps, AppState> {
    // Maps to store key -> arr index for quick lookups

    constructor(props: AppProps) {
        super(props);
        this.state = {
            isShowList: true,
            editPojectId: 1
        };
        // init maps
    }

    //得到project的一系列信息
    private getDataJson(kind: string) {
        let url = "http://localhost:9999?id=" + this.state.editPojectId + "&type=" + kind
        let httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        //需要异步请求
        httpRequest.open('GET', url, false);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        let dataJson = JSON.parse(httpRequest.responseText);
        return dataJson;
    }

    private getProjectList() {
        let url = "http://localhost:9999/projectList"
        let httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        //需要异步请求
        httpRequest.open('GET', url, false);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        let dataJson = JSON.parse(httpRequest.responseText);
        return dataJson;
    }

    private setProjectInfo = (info: any) => {
        console.log("setProjectInfo:", info);
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', 'http://localhost:9999/', true);
        httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        httpRequest.send("id=" + this.state.editPojectId + "&info=" + JSON.stringify(info));
        return;
    }
    private setIsShowListChange = (flag: boolean) => {
        this.setState({isShowList: flag});
        return;
    }

    private renderObjectDetails() {
        const projectList = this.getProjectList();
        console.log("projectList", projectList)
        let dets = new Array();
        if (projectList === undefined)
            return;
        projectList.forEach((p: any) => {
            const row =
                <TableRow sx={{padding: 8}}>
                    <TableCell> {p["name"]}</TableCell>
                    <TableCell> {p["annotation"]}</TableCell>
                    <TableCell> {p["create_time"]}</TableCell>
                    <TableCell> {p["update_time"]}</TableCell>
                    <button onClick={() => this.setState({
                        isShowList: false,
                        editPojectId: p["id"]
                    })}>Edit
                    </button>
                </TableRow>
            dets.push(row)
        })
        return dets;
    }


    public render() {

        let Breadcrumbs = IconBreadcrumbs(this.setIsShowListChange);
        if (this.state.isShowList) {
            return (
                <div>
                    {Breadcrumbs}
                    <Paper sx={{width: '1000px'}}>
                        <br/><br/><br/><br/>
                        <h2>Project List</h2>
                        <TableContainer sx={{height: '200px'}}>
                            <Table stickyHeader aria-label="sticky table"
                                   size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{maxWidth: '10px'}}>name</TableCell>
                                        <TableCell
                                            sx={{maxWidth: '20px'}}>anno</TableCell>
                                        <TableCell>cerate_time</TableCell>
                                        <TableCell>update_time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.renderObjectDetails()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>

            )
        } else {
            return (
                <div>
                    {Breadcrumbs}
                    <ProjectSever GoJSmodel={this.getDataJson("model")}
                                  treeInfo={this.getDataJson("tree")["tree_info"]}
                                  ModelicaModelItem={this.getDataJson("item")["model_info"]}
                                  setProjectInfoHandler={(Info: any) => this.setProjectInfo(Info)}
                    />
                </div>
            )
        }
    }
}

export default ProjectManager;
