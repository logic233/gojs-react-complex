import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface ParaInspectorProps {
    selectedData: any;
    paraInfo: any;
    handleParaValue: (nodeKey: string, paraKey: string, paraValue: string) => void;
}


//显示模型参数并且提供更改
export class ParaInspector extends React.PureComponent<ParaInspectorProps, { value: Map<string, number> }> {
    /**
     * Render the object data, passing down property keys and values.
     */
    constructor(props: ParaInspectorProps) {
        super(props);
        let valueMap = (this.props.selectedData["parameterValues"]);
        //组件自己维持一个状态，用于渲染
        this.state = {value: valueMap};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: any) {
        let newValue = JSON.parse(JSON.stringify(this.state.value));
        newValue[event.target.name] = (event.target.value);
        this.setState({value: newValue});
        this.props.handleParaValue(this.props.selectedData.key, event.target.name, event.target.value);
    }

    private renderObjectDetails() {
        const para = this.props.paraInfo;
        let dets = new Array();
        if (para === undefined)
            return;
        para.forEach((p: any) => {
            const row =
                <TableRow sx={{padding: 8}}>
                    <TableCell> {p["name"]}</TableCell>
                    <TableCell><input name={p["name"]} type="text"
                               value={(this.state.value !== undefined && this.state.value[p["name"]]) ? this.state.value[p["name"]] : " "}
                               onChange={this.handleChange}/></TableCell>
                    <TableCell> {p["type"]}</TableCell>
                    <TableCell> {p["anno"]}</TableCell>
                </TableRow>
            dets.push(row)
        })

        return dets;
    }

    public render() {
        return (
            <Paper sx={{width: '1000px'}}>
                Parameter :
                <TableContainer sx={{height:'200px'}}>
                    <Table stickyHeader aria-label="sticky table" size="small" >
                        <TableHead>
                            <TableRow >
                                <TableCell sx={{maxWidth: '10px'}}  >name</TableCell>
                                <TableCell  sx={{maxWidth: '20px'}}>value</TableCell>
                                <TableCell >type</TableCell>
                                <TableCell   >description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderObjectDetails()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        );
    }
}