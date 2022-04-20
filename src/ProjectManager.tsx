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
import Button from '@mui/material/Button';

import ProjectSever from './App'
import IconBreadcrumbs from "./components/BreadCrumb";
import {PackageDialog} from "./components/PackageDialog";

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

    //请求project的一系列信息
    private getDataJson(kind: string) {
        let url = "http://localhost:9999?id=" + this.state.editPojectId + "&type=" + kind
        let httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        //需要异步请求
        httpRequest.open('GET', url, false);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        let dataJson = JSON.parse(httpRequest.responseText);
        return dataJson;
    }

//得到两类projectList 和 packageList
    private getList(ListName: string) {
        let url = "http://localhost:9999/" + ListName + "List";
        let httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        //需要异步请求
        httpRequest.open('GET', url, false);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        let dataJson = JSON.parse(httpRequest.responseText);
        return dataJson;
    }

    private getProjectRelyDict(projectId: string) {
        let url = "http://localhost:9999/projectRely?id=" + projectId;
        let httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        //需要异步请求
        httpRequest.open('GET', url, false);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        let data = JSON.parse(httpRequest.responseText);
        let idDict = {};
        data.forEach((item: any) => {
            idDict[item["package_id"]] = true;
        })
        console.log("idDict", idDict);
        return idDict;
    }

    private setProjectRely = (id: string, ins: any, del: any) => {
        console.log("setProjectRely:", ins, del);
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', 'http://localhost:9999/projectRely', true);
        httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        httpRequest.send("id=" + id + "&insert=" + JSON.stringify(ins) + "&delete=" + JSON.stringify(del));
        return;
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
    // private saveProjectRely

//render table
    private renderObjectDetails() {
        const projectList = this.getList("project");
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
                    {/*edit*/}
                    <Button variant="outlined" onClick={() => this.setState({
                        isShowList: false,
                        editPojectId: p["id"]
                    })}>Edit
                    </Button>
                    <PackageDialog
                        projectId={p["id"]}
                        packageList={JSON.stringify(this.getList("package"))}
                        relyPackageDict={JSON.stringify(this.getProjectRelyDict(p["id"]))}
                        setProjectRely={this.setProjectRely}
                    />
                    <Button variant="outlined" onClick={() => this.setState({
                        isShowList: false,
                        editPojectId: p["id"]
                    })}>Dele
                    </Button>
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

                    <br/><br/><br/><br/>
                    <h2>Project List</h2>
                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table"
                               size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{maxWidth: '10px'}}>name</TableCell>
                                    <TableCell
                                        sx={{maxWidth: '20px'}}>anno</TableCell>
                                    <TableCell
                                        sx={{maxWidth: '20px'}}>cerate_time</TableCell>
                                    <TableCell
                                        sx={{maxWidth: '20px'}}>update_time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.renderObjectDetails()}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>

            )
        } else {
            return (
                <div>
                    {Breadcrumbs}
                    <ProjectSever GoJSmodel={this.getDataJson("project")}
                                  treeInfo={this.getDataJson("tree")["tree_info"]}
                                  ModelicaModelItem={this.getDataJson("model")["model_info"]}
                                  setProjectInfoHandler={(Info: any) => this.setProjectInfo(Info)}
                    />
                </div>
            )
        }
    }
}

export default ProjectManager;
