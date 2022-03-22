/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as React from 'react';

import {InspectorRow} from './InspectorRow';

import './Inspector.css';
import {paraVaule2Map} from "../tool/common";

interface SelectionInspectorProps {
    selectedData: any;
    onInputChange: (id: string, value: string, isBlur: boolean) => void;
}

interface DataInspectorProps {
    selectedData: any;
    onInputChange: (id: string, value: string, isBlur: boolean) => void;
    paraInfo: any;
    handleParaValue:(nodeKey: string, paraValues: Map<string, number>)=>void;
}


export class SelectionInspector extends React.PureComponent<SelectionInspectorProps, {}> {
    /**
     * Render the object data, passing down property keys and values.
     */
    private renderObjectDetails() {
        const selObj = this.props.selectedData;
        console.log('selObj: ', selObj);
        const dets = [];
        for (const k in selObj) {
            if (k === 'para') {
                continue;
            }
            const val = selObj[k];
            const row = <InspectorRow
                key={k}
                id={k}
                value={val}
                onInputChange={this.props.onInputChange}/>;
            if (k === 'key') {
                dets.unshift(row); // key always at start
            } else {
                dets.push(row);
            }
        }
        return dets;
    }

    public render() {
        return (
            <div id='myInspectorDiv' className='inspector'>
                <table>
                    <tbody>
                    {this.renderObjectDetails()}
                    </tbody>
                </table>
            </div>
        );
    }
}


//显示模型参数并且提供更改
export class DataInspector extends React.PureComponent<DataInspectorProps, { value: Map<string,number> }> {
    /**
     * Render the object data, passing down property keys and values.
     */



    constructor(props: DataInspectorProps) {
        super(props);
        let valueMap = paraVaule2Map(this.props.selectedData["parameterValues"]);


        this.state = {value: valueMap};
        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: any) {
        let newValue = this.state.value;
        newValue.set(event.target.name,event.target.value);
        this.setState({value: newValue});
        // console.log(this.props.handleParaValue)
        this.props.handleParaValue(this.props.selectedData.key,newValue);
    }

    public getValue = () => {
        // console.log(this.state.value);
        return this.state.value;
    }

    private renderObjectDetails() {
        // const selObj = this.props.selectedData;
        const para = this.props.paraInfo;
        // console.log(this.state.value);
        let dets = [];
        if (para === undefined) {
            return <p>this model has no paras</p>
        } else {
            const row =
                <tr>
                    <th>name</th>
                    <th>value</th>
                    <th>type</th>
                    <th>description</th>
                </tr>
            dets.push(row)
            para.forEach((p: any) => {
                const row =
                    <tr>
                        <td> {p["name"]}</td>
                        <td><input name={p["name"]} type="text"
                                   value={this.state.value.get(p["name"])}
                                   onChange={this.handleChange}/></td>
                        <td> {p["type"]}</td>
                        <td> {p["anno"]}</td>
                    </tr>
                dets.push(row)
            })
        }
        return dets;
    }

    public render() {
        return (
            <div id='myDataInspectorDiv' className='datainspector'>
                <h1>parameters</h1>
                <table id='mytable'>
                    {this.renderObjectDetails()}
                </table>
            </div>
        );
    }
}