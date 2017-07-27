/**
 * Created by Gerwin Bosch on 3-7-2017.
 */
import React, {Component} from 'react';
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import CheckBox from 'material-ui/Checkbox'
import Dialog from 'material-ui/Dialog';
import 'whatwg-fetch'
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper'
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

class DataClassifyView extends Component {
    constructor(props) {
        super(props);
        this.state = (
            {
                dialog: {
                    open: false,
                    id: 0,
                    searchText: '',
                    results: [],
                    stepIndex:0,
                    vocabPickerIndex:0,
                }
            }
        )
    }

    /* Renders the source link */
    renderSourceLink(id) {
        let object = this.props.data[id];
        if (object.class.name !== 'Literal') {
            return <a href={object.class.uri}>{object.class.name}</a>
        }

    }

    //Opens the dialog and set the row number of the item that was picked
    handleOpen(i) {
        let dialog = this.state.dialog;
        dialog.open=true;
        dialog.id=i;
        this.setState({
            dialog: dialog
        })
    }

    handleClose() {
        let dialog = this.state.dialog;
        dialog.open=false;
        dialog.id=-1;
        dialog.stepIndex=0;
        this.setState({
            dialog: dialog
        })
    }

    onChange(object, string) {
        let dialog = this.state.dialog;
        dialog.searchText = string;
        this.setState({dialog: dialog});
    }

    searchVocabulary(e) {
        let query = this.state.dialog.searchText;
        let dialog = this.state.dialog;
        fetch('http://lov.okfn.org/dataset/lov/api/v2/term/search?q=' + query + '&type=class')
            .then(function (response) {
                return response.json()
            }).then(function (json) {
            dialog.results = json.results.map(
                function (item) {
                    return {
                        uri: item.uri[0],
                        vocabPrefix: item['vocabulary.prefix'][0],
                        prefix: item.prefixedName[0]
                    };
                }
            );
            this.setState({dialog: dialog});
        }.bind(this)).catch(function (ex) {
            console.log('parsing failed', ex)
        });
        e.preventDefault();
    }

    handlePick(index) {
        let dialog = this.state.dialog;
        let result = dialog.results[dialog.vocabPickerIndex];
        result.name = result.prefix.split(':')[1];
        this.props.setClass(this.state.dialog.id, result);
        this.props.setUri(this.state.dialog.id,true);
        this.setState({
                dialog: {
                    open: false,
                    id: -1,
                    stepIndex:0,
                    vocabPickerIndex:0,
                }
            }
        )
    }

    renderDialogTableBody() {
        if (this.state.dialog.results) {
            return this.state.dialog.results.map((column, index) =>
                <MenuItem value={index} label={column.prefix} primaryText={column.prefix}/>
            )

        } else {

        }

    }

    toNextPage() {
        this.props.nextPage(this.state.data);
    }
    onBaseUriChange(index,text){
        this.props.setBaseUri(index,text)
    }

    getAmountOfClasses() {
        let classes = this.props.data.slice();
        let counter = 0;
        for (let i = 0; i < classes.length; i++) {
            let item = classes[i];
            if (item.uri) {
                counter++;
            }
        }
        return counter;
    }
    onVocabPicked(e, index){
        let dialog = this.state.dialog;
        dialog.vocabPickerIndex=index;
    }
    continueDisabled(){
        let classes = this.props.data.slice();
        if(this.getAmountOfClasses() === 0) return true;
           return false;

    }
    startClassification(index,boolean){
        this.handleOpen(index);

    }
    renderDialogBody(){
        let item = this.props.data[this.state.dialog.id]
        if(!item){
            return <div/>
        }
        switch(this.state.dialog.stepIndex){
            case 0:
                return (
                    <div>
                        <p>When the data is not a proper URI... Stan's todo</p>
                        <p>Column name: {item.columnName}</p>
                        <p>Example value: {item.exampleValue}</p>
                            <TextField name="Base-uri:" type="url" hintText="Input the URL from which the data will start" onChange={(event, string) => this.onBaseUriChange(this.state.dialog.id,string)}/>
                    </div>

                );
            break;
            case 1:
                return (
                    <div>
                        <p>Some text written by stan goes here</p>
                        <form onSubmit={this.searchVocabulary.bind(this)}>
                            <TextField name="Search vocabularies" hintText="class name" onChange={this.onChange.bind(this)}/>
                            <IconButton type="submit"><ActionSearch/></IconButton>
                        </form>
                        <p>Some text written by stan goes here</p>
                        <DropDownMenu value={this.state.dialog.vocabPickerIndex} onChange={this.onVocabPicked.bind(this)}>
                            {this.renderDialogTableBody()}
                        </DropDownMenu>
                    </div>
                );
            break;
            default:
                return <div/>
        }

    }
    handleNext(){
        let dialog = this.state.dialog;
        dialog.stepIndex=1;
        this.setState({
            dialog:dialog
        })
    }
    resetItem(index){
        this.props.setClass(index, {name:'Literal'});
        this.props.setUri(index,false);
        this.props.setBaseUri(index,null)
    }


    render() {
        const actions = [
            <FlatButton
                label= {(this.state.dialog.stepIndex===0) ? 'Next':'Finish'}
                primary={true}
                onClick={(this.state.dialog.stepIndex===0) ? this.handleNext.bind(this):this.handlePick.bind(this)}
            />,
            <FlatButton
            label='Cancel'
            primary={false}
            onClick={this.handleClose.bind(this)}
    />
        ];
        return (
            <div>
                <Paper zDepth={2}>
                    <div style={{width: '100%', display: 'inline-block'}}>
                        <FlatButton
                            label="continue"
                            disabled={this.continueDisabled()}
                            onClick={() => this.toNextPage()}
                            style={{
                                float: 'right',
                                margin: 14
                            }}/>
                    </div>

                </Paper>
                <Paper zDepth={1}>
                    <Table selectable={false}>
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn tooltip="the column name">ColumnName</TableHeaderColumn>
                                <TableHeaderColumn tooltip="The first value">Example Value</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Is this a root node">Root node</TableHeaderColumn>
                                <TableHeaderColumn tooltip="The type">type</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Base URI">Base URI</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Reset">Reset</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            //[[C1,C2,C3,C4,C5,C6]
                            //[V1,V2,V3,V4,V5,V6]]
                            {
                                this.props.data.map((column, index) =>
                                    <TableRow key={index}>
                                        <TableRowColumn>{column.columnName}</TableRowColumn>
                                        <TableRowColumn>{column.exampleValue}</TableRowColumn>
                                        <TableRowColumn>
                                            <CheckBox checked={column.uri} onCheck={()=>this.startClassification(index,!column.uri)} disabled={column.uri}/>
                                        </TableRowColumn>
                                        <TableRowColumn>{column.class.name}</TableRowColumn>
                                        <TableRowColumn>{column.baseUri ? column.baseUri : ''}</TableRowColumn>
                                        <TableRowColumn>
                                            {
                                                column.uri ?
                                                (
                                                <IconButton onClick={(e)=>this.resetItem(index)}>
                                                    <ArrowBack/>
                                                </IconButton>
                                                ) :
                                                <div/>
                                            }
                                        </TableRowColumn>

                                    </TableRow>
                                )
                            }
                        </TableBody>

                    </Table>
                </Paper>
                <Dialog
                    actions={actions}
                    modal={true}
                    open={this.state.dialog.open}
                >
                    <Stepper activeStep={this.state.dialog.stepIndex}>
                        <Step>
                            <StepLabel>Pick URI</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Select class</StepLabel>
                        </Step>
                    </Stepper>
                    {this.renderDialogBody()}
                </Dialog>
            </div>
        )
    }

}

export default DataClassifyView