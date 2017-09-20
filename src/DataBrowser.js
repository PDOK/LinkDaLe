import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { getDefaultGraph, removeData, removeContextData, getAllDataFrom } from './querybuilder';
import TripleVisualizer from './TripleVisualizer';

const rdfsType = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const dcCreated = 'http://purl.org/dc/terms/created';
const dcDescription = 'http://purl.org/dc/terms/description';
const dcTitle = 'http://purl.org/dc/terms/title';

class DataBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphContexts: {},
      currentSelected: 0,
      data: [],
      error: '',
      snackbar: {
        open: false,
        message: 'hi i\'m a snackbar',
      },
      dialog: {
        open: false,
      },
      mounted: true,

    };
    props.executeQuery(getDefaultGraph(), (err, results) => {
      if (err) {
        this.setState({ error: err.message, data: [], headers: [] });
      } else {
        const currentstore = {};
        if (results.length !== 0) {
          results.forEach((result) => {
            if (!currentstore[result.subject.value]) {
              currentstore[result.subject.value] = {};
            }
            currentstore[result.subject.value][result.predicate.value] = result.object.value;
          });
        }
        if (this.state.mounted) {
          this.setState({ graphContexts: currentstore });
          this.getGraphData(Object.keys(currentstore)[0]);
        }
      }
    });
  }
  componentWillUnmount() {
    this.setState({ mounted: false });
  }
  getGraphData = (graphname) => {
    this.props.executeQuery(getAllDataFrom(graphname), (err, result) => {
      if (err) {
        this.setState({ error: err.message });
      } else if (this.state.mounted) {
        const data = result.map(row => [row.s, row.p, row.o]);
        if (this.state.mounted) {
          this.setState({ data });
        }
      }
    });
  };
  deleteGraph = (graphname) => {
    this.props.executeQuery(removeContextData(graphname), (err) => {
      if (err) {
        this.setState({ error: err.message });
      } else {
        this.props.executeQuery(removeData(graphname), (err2) => {
          if (err2) {
            this.setState({ error: err2.message });
          } else {
            const snackbar = this.state.snackbar;
            snackbar.open = true;
            snackbar.message = 'Graph successfully removed';
            this.setState({
              snackbar,
            });
          }
        });
      }
    });
    this.closeDialog();
  };
  handleRequestClose = () => {
    const snackbar = this.state.snackbar;
    snackbar.open = false;
    this.setState({
      snackbar,
    });
  };
  openDialog = row => this.setState({ dialog: { open: true, row } });
  closeDialog = () => this.setState({ dialog: { open: false, row: -1 } });


  changeCurrentGraph = (row, selectedIndex) => {
    switch (selectedIndex) {
      case -1:
        this.setState({ currentSelected: row });
        this.getGraphData(Object.keys(this.state.graphContexts)[row]);
        break;
      case 4:
        this.openDialog(row);
        break;
      default:
    }
  };

  renderGraphTable() {
    return (
      <Table selectable onCellClick={this.changeCurrentGraph} wrapperStyle={{ maxHeight: '40vh' }} >
        <TableHeader displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn tooltip="the Title">Title</TableHeaderColumn>
            <TableHeaderColumn tooltip="The description" >Description</TableHeaderColumn>
            <TableHeaderColumn tooltip="The URI">URI</TableHeaderColumn>
            <TableHeaderColumn tooltip="The data of creation">Date</TableHeaderColumn>
            <TableHeaderColumn tooltip="Remove the dataset">Delete</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          onRowSelection={this.changeCurrentGraph}
          deselectOnClickaway={false}
          style={{ maxHeight: '20vh' }}
        >
          {
            (Object.keys(this.state.graphContexts).length !== 0) ?
              Object.keys(this.state.graphContexts).map((key, count) => {
                const graph = this.state.graphContexts[key];
                // Limited filtering
                if (graph[rdfsType] && graph[rdfsType] === 'http://rdfs.org/ns/void#Dataset') {
                  return (
                    <TableRow key={graph[dcTitle]} selected={count === this.state.currentSelected}>
                      <TableRowColumn>{graph[dcTitle]}</TableRowColumn>
                      <TableRowColumn>{graph[dcDescription]}</TableRowColumn>
                      <TableRowColumn>{key}</TableRowColumn>
                      <TableRowColumn>{graph[dcCreated]}</TableRowColumn>
                      <TableRowColumn><IconButton><Delete /></IconButton></TableRowColumn>
                    </TableRow>
                  );
                }
                return <space />;
              }) :
              <TableRow><TableRowColumn colSpan="5" style={{ textAlign: 'center' }}>No dataset available</TableRowColumn></TableRow>
          }
        </TableBody>
      </Table>
    );
  }
  render() {
    const dialogActions = [
      <FlatButton label={'No'} primary onClick={this.closeDialog} />,
      <FlatButton label={'Yes'} secondary onClick={() => this.deleteGraph(Object.keys(this.state.graphContexts)[this.state.dialog.row])} />,
    ];
    return (
      <div style={{ display: 'flex', maxHeight: 'auto', height: '100%', flexDirection: 'column', overflow: 'hidden', minHeight: 'min-content', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ overflow: 'auto', flex: 1, display: 'flex', alignItems: 'stretch' }}>
          {this.renderGraphTable()}
        </div>
        <div style={{ overflow: 'auto', flex: 1, display: 'flex', alignItems: 'stretch' }}>
          <TripleVisualizer
            data={this.state.data}
            error={this.state.error}
          />
        </div>
        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <Dialog title="Are you sure?" actions={dialogActions} open={this.state.dialog.open}>
          <p>You are going to delete a dataset!</p>
          <p><strong>There is no user access control!</strong> </p>
          <p>Therefore you can accidentally delete SOMEBODY&#39;s else data.</p>
          <p><strong>Be careful!</strong></p>
        </Dialog>
      </div>
    );
  }
}
DataBrowser.propTypes = {
  executeQuery: Proptypes.func.isRequired,
};

export default DataBrowser;

