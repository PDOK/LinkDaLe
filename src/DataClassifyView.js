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

class DataClassifyView extends Component {
    constructor(props) {
        super(props);
        this.state = (
            {
                dialog: {
                    open: false,
                    id: 0,
                    searchText: '',
                    results: []
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
        this.setState({
            dialog: {
                open: true,
                id: i
            }
        })
    }

    handleClose() {
        this.setState(
            {
                dialog: {
                    open: false,
                    id: -1
                }
            }
        )
    }

    onChange(object, string) {
        let dialog = this.state.dialog;
        dialog.searchText = string;
        this.setState({dialog: dialog});
    }

    searchVocabulary() {
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
        })
    }

    handlePick(index) {
        let dialog = this.state.dialog;
        let result = dialog.results[index];
        result.name = result.prefix.split(':')[1];
        console.log('index',index);
        this.props.setClass(this.state.dialog.id, result);
        this.setState({
                dialog: {
                    open: false,
                    id: -1
                }
            }
        )
    }

    renderDialogTableBody() {
        if (this.state.dialog.results) {
            return this.state.dialog.results.map((column, index) =>
                <TableRow key={index}>
                    <TableRowColumn>{column.vocabPrefix}</TableRowColumn>
                    <TableRowColumn><a href={column.uri}>{column.uri}</a></TableRowColumn>
                    <TableRowColumn>{column.prefix}</TableRowColumn>
                    <TableRowColumn><RaisedButton
                        onClick={() => this.handlePick(index)}>pick</RaisedButton></TableRowColumn>
                </TableRow>
            )

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


    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose.bind(this)}
            />
        ];
        return (
            <div>
                <Paper zDepth={2}>
                    <div style={{width: '100%', display: 'inline-block'}}>
                        <FlatButton
                            label="continue"
                            disabled={this.getAmountOfClasses() === 0}
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
                                <TableHeaderColumn tooltip="The class it will be defined as">Class</TableHeaderColumn>
                                <TableHeaderColumn style={{width:'12px'}}
                                    tooltip="If this class should be considered a URI">Uri</TableHeaderColumn>
                                <TableHeaderColumn style={{width:'24px'}} tooltip="If this class is also a label">Label</TableHeaderColumn>
                                <TableHeaderColumn tooltip="The base URI of the class">Base URI</TableHeaderColumn>
                                <TableHeaderColumn tooltip="The result of the transformation">Result</TableHeaderColumn>
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
                                        <TableRowColumn><RaisedButton disabled={!column.uri}
                                                                      onClick={() => this.handleOpen(index)}>{column.class.name}</RaisedButton></TableRowColumn>
                                        <TableRowColumn style={{width:'24px'}}><CheckBox value={index}
                                                                  onCheck={() => this.props.setUri(index, !column.uri)}
                                                                  checked={column.uri}/></TableRowColumn>
                                        <TableRowColumn style={{width:'24px'}}><CheckBox checked={column.label}
                                                                  onCheck={() => this.props.setLabel(index, !column.label)}
                                                                  disabled={!column.uri}/></TableRowColumn>
                                        <TableRowColumn><TextField
                                                                  id={column.columnName}
                                                                  onChange={(event, string) => this.onBaseUriChange(index,string)}
                                                                  disabled={!column.label}/></TableRowColumn>
                                        <TableRowColumn>{this.renderSourceLink(index)}</TableRowColumn>

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
                    <div style={{width: '100%'}}>
                        <TextField style={{width: '80%'}} floatingLabelText="Class name"
                                   onChange={this.onChange.bind(this)}/>
                        <IconButton>
                            <ActionSearch onClick={this.searchVocabulary.bind(this)}/>
                        </IconButton>
                    </div>
                    <div style={{minHeight: '400px'}}>
                        <Table wrapperStyle={{paddingBottom: '27px'}}>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    <TableHeaderColumn
                                        tooltip="The vocabulary the class originates from">Vocabulary</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="Link to the class description">uri</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="The full prefix">Prefix</TableHeaderColumn>
                                    <TableHeaderColumn>Select</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                //[[C1,C2,C3,C4,C5,C6]
                                //[V1,V2,V3,V4,V5,V6]]
                                {this.renderDialogTableBody()}

                            </TableBody>

                        </Table>


                    </div>


                </Dialog>
            </div>
        )
    }

}

export default DataClassifyView