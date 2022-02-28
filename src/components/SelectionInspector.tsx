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



export class DataInspector extends React.PureComponent<SelectionInspectorProps, {}> {
  /**
   * Render the object data, passing down property keys and values.
   */
  private renderObjectDetails() {
    const selObj = this.props.selectedData;
    const data = selObj["data"]
    const dets = [];
    if (data == undefined){
      return
    }
    else{
      dets.push(<h1>para</h1>)
      let  item_list = data.split(";")
      for(let i=0;i<item_list.length-1;i++){
        let item_ = item_list[i].split(" ")
        let _name = item_[0]
        let _value = item_[1]
        const row = <input type="text" name={_name} value={_value}/>
        dets.push(row)

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