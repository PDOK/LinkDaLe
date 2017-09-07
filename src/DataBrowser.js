/* eslint-disable react/jsx-no-bind,react/jsx-filename-extension */
import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
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
    };
    props.executeQuery(getDefaultGraph(), (err, results) => {
      if (err) {
        // TODO: implement error state
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
        this.setState({ graphContexts: currentstore });
        this.getGraphData(Object.keys(currentstore)[0]);
      }
    });
  }
  getGraphData = (graphname) => {
    this.props.executeQuery(getAllDataFrom(graphname), (err, result) => {
      if (err) {
        console.error('Couldnt Grab data');
      } else {
        const data = result.map(row => [row.s, row.p, row.o]);
        this.setState({ data });
      }
    });
  };
  deleteGraph = (graphname) => {
    this.props.executeQuery(removeContextData(graphname), (err) => {
      if (err) {
        console.error(err);
      } else {
        this.props.executeQuery(removeData(graphname), (err2) => {
          console.log('Data deleted');
          if (err2) {
            console.error(err2);
          } else {
            console.log('Context deleted');
          }
        });
      }
    });
  };


  changeCurrentGraph = (row, selectedIndex) => {
    switch (selectedIndex) {
      case -1:
        this.setState({ currentSelected: row });
        this.getGraphData(Object.keys(this.state.graphContexts)[row]);
        break;
      case 4:
        this.deleteGraph(Object.keys(this.state.graphContexts)[row]);
        break;
      default:
    }
  };

  renderGraphTable() {
    return (
      <Table selectable onCellClick={this.changeCurrentGraph.bind(this)} wrapperStyle={{ maxHeight: '40vh' }} >
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
          onRowSelection={this.changeCurrentGraph.bind(this)}
          deselectOnClickaway={false}
          style={{ maxHeight: '20vh' }}
        >
          {
            (Object.keys(this.state.graphContexts).length !== 0) ?
            Object.keys(this.state.graphContexts).map((key, count) => {
              const graph = this.state.graphContexts[key];
            // Limited filtering
              if (graph[rdfsType] && graph[rdfsType] === 'http://rdfs.org/ns/void#Datset') {
                return (
                  <TableRow selected={count === this.state.currentSelected}>
                    <TableRowColumn>{graph[dcTitle]}</TableRowColumn>
                    <TableRowColumn>{graph[dcDescription]}</TableRowColumn>
                    <TableRowColumn>{key}</TableRowColumn>
                    <TableRowColumn>{graph[dcCreated]}</TableRowColumn>
                    <TableRowColumn><IconButton disabled><Delete /></IconButton></TableRowColumn>
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
    return (
      <div style={{ display: 'flex', maxHeight: 'auto', height: '100%', flexDirection: 'column', overflow: 'hidden', minHeight: 'min-content', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ overflow: 'auto', flex: 1, display: 'flex', alignItems: 'stretch' }}>
          {this.renderGraphTable()}
        </div>
        <div style={{ overflow: 'auto', flex: 1, display: 'flex', alignItems: 'stretch' }}>
          <TripleVisualizer data={this.state.data} />
        </div>
      </div>

    );
  }
}
DataBrowser.propTypes = {
  executeQuery: Proptypes.func.isRequired,
};

export default DataBrowser;

