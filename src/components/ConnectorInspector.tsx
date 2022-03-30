import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface ConnectorInspectorProps {
    selectedData: any;
    connectorInfo: any;
}

//显示模型参数并且提供更改
export class ConnectorInspector extends React.PureComponent<ConnectorInspectorProps, {}> {
    /**
     * Render the object data, passing down property keys and values.
     */
    constructor(props: ConnectorInspectorProps) {
        super(props);
    }


    private renderObjectDetails() {
        const para = this.props.connectorInfo;
        let dets = new Array();

        para.forEach((p: any) => {
            const row =
                <TableRow sx={{padding: 8}}>
                    <TableCell> {p["name"]}</TableCell>
                    <TableCell> {p["class"]}</TableCell>
                    <TableCell> {p["anno"]}</TableCell>
                </TableRow>
            dets.push(row)
        })

        return dets;
    }

    public render() {
        if (this.props.connectorInfo === undefined)
            return null;

        return (
            <Paper sx={{width: '1000px'}}>
                Connectors:
                <TableContainer sx={{height: '200px'}}>
                    <Table stickyHeader aria-label="sticky table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{maxWidth: '10px'}}>name</TableCell>
                                <TableCell>type</TableCell>
                                <TableCell>description</TableCell>
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