import * as React from "react";
import Checkbox from '@mui/material/Checkbox';



interface AppProps {
    beginState: boolean;
    id : number;
    changePackageDictHandler : (id:number)=>void;
}
interface AppState{
    checked :boolean;
}


export class CheckBox extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.state = {
            checked: this.props.beginState,
        };
    }

    private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({checked:event.target.checked})
        this.props.changePackageDictHandler(this.props.id);
    };

    public render() {
        return (
            <Checkbox
                checked={this.state.checked}
                onChange={this.handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        );
    }
}