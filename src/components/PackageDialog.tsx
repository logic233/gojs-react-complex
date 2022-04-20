import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {CheckBox} from "./CheckBox";


interface AppState {
    open: boolean,
    relyPackageDict: any
}


interface AppProps {
    projectId: string,
    packageList: string;
    relyPackageDict: string;
    setProjectRely :(id:string,ins:any,del:any)=>void;
}

export class PackageDialog extends React.Component<AppProps, AppState> {
    private packageList: any;
    private relyPackageDict_backup: any;

    constructor(props: AppProps) {
        super(props);
        this.packageList = JSON.parse(this.props.packageList);
        this.state = {
            open: false,
            relyPackageDict: JSON.parse(this.props.relyPackageDict)
        };

    }

    private handleClickOpen = () => {
        console.log("this.state.relyPackageDict", this.state.relyPackageDict)
        this.relyPackageDict_backup = this.state.relyPackageDict;
        this.setState({open: true})
    }
    private handleClose = () => {
        this.setState({open: false})
    }
    private handleCancel = () => {
        this.setState({
            open: false,
            relyPackageDict: this.relyPackageDict_backup
        })

    }

    private handleApply = () => {
        let deleteRely = new Array()
        let insertRely = new Array()
        this.packageList.map((item:any)=>{
            let id = item["id"];
            if(!this.relyPackageDict_backup[id]&&this.state.relyPackageDict[id])
                insertRely.push(id);
            if(this.relyPackageDict_backup[id]&&!this.state.relyPackageDict[id])
                deleteRely.push(id);
        }
    )
        console.log("del",deleteRely,"in",insertRely);
        this.props.setProjectRely(this.props.projectId,insertRely,deleteRely);
        this.handleClose();
    }

    private changePackageDictHandler = (package_id: number) => {
        let state = JSON.parse(JSON.stringify(this.state.relyPackageDict))
        let flag = state[package_id];
        state[package_id] = flag ? false : true;
        this.setState({
            relyPackageDict: state
        })
        return;
    }

    private renderTable = () => {
        let rows = this.packageList;
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>annotation</TableCell>
                            <TableCell>Rely</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: any) => (
                            <TableRow
                                key={row.id}
                                // sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell >
                                    {row.name}
                                </TableCell>
                                <TableCell >
                                    {row.annotation}
                                </TableCell>
                                <TableCell align="center">
                                    <CheckBox
                                        beginState={this.state.relyPackageDict[row.id] === true}
                                        id={row.id}
                                        changePackageDictHandler={this.changePackageDictHandler}
                                    >
                                    </CheckBox>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );

    }


    public render() {
        return (
            <div>
                <Button variant="outlined" onClick={this.handleClickOpen}>
                    Rely
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose} maxWidth={ 'md' }>
                    <DialogTitle>Project's Rely</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.props.projectId}
                        </DialogContentText>
                        {this.renderTable()}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                        <Button onClick={this.handleApply}>Apply</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}