/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as React from 'react';

import { InspectorRow } from './InspectorRow';

import './Inspector.css';

interface SelectionInspectorProps {
  selectedData: any;
  onInputChange: (id: string, value: string, isBlur: boolean) => void;
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
      if(k==='data'){
        continue;
      }
      const val = selObj[k];
      const row = <InspectorRow
                    key={k}
                    id={k}
                    value={val}
                    onInputChange={this.props.onInputChange} />;
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
export class DataInspector extends React.PureComponent<SelectionInspectorProps,{value?:Array<number>}> {
  /**
   * Render the object data, passing down property keys and values.
   */



   constructor(props: SelectionInspectorProps) {
    super(props);
    this.state = {value: new Array(100) };
    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event: any) {    
    console.log(this.state.value);
    var i = event.target.name;
    var newValue = this.state.value;
    newValue![i]=event.target.value;
    this.setState({value: newValue});  
  }


  private renderObjectDetails() {
    const selObj = this.props.selectedData;
    const para = selObj["para"]
    console.log(this.state.value);
    const dets = [];
    if (para == undefined){
      return
    }
    else{
      dets.push(<h1>para</h1>)
      for(let i=0;i<para.length;i++){
        
        const row = <input name={i+""} type="text"  value={this.state.value![i]}  onChange={this.handleChange}/>
        dets.push(row)
        dets.push(<br></br>)

      }

    }
    return dets;
  }

  public render() {
    return (
      <div id='myDataInspectorDiv' className='datainspector'>
        <table>
          <tbody>
            {this.renderObjectDetails()}
          </tbody>
        </table>
      </div>
    );
  }
}