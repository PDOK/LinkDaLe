/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import CodeMirror from 'react-codemirror';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Play from 'material-ui/svg-icons/av/play-arrow';
import PropTypes from 'prop-types';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/theme/material.css';
import SparqlVisualizer from './SparqlVisualizer';
import { getDefaultGraph } from './querybuilder';

class QueryWriter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: 'SELECT ?s ?p ?o {?s ?p ?o}',
      data: [],
      graphContexts: [],
      selectedGraph: {},
      headers: [],
      error: '',
    };
    props.executeQuery(getDefaultGraph(), (err, results) => {
      if (err) {
        // TODO: implement error state
        this.setState({ error: err });
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
        const graphData = Object.keys(currentstore).map(
            item => ({ name: currentstore[item]['http://purl.org/dc/terms/title'], uri: item }));
        this.setState({ graphContexts: graphData });
      }
    });
  }
  onDataSourceChange = (event, index, value) => {
    console.log(value);
    this.setState({ selectedGraph: value });
  };

  onQueryChange = (query) => {
    // TOOD: implement validation and safeguards?
    this.setState({ query });
  };

  onFireQuery = () => {
    this.props.executeQueryInEnvironment(
        this.state.query, this.state.selectedGraph.uri, this.onQueryCallBack);
  };

  onQueryCallBack = (err, results) => {
    if (err) {
      this.setState({ error: err.message, data: [], headers: [] });
    } else if (results.length === 0) {
      this.setState({ error: '', data: [], headers: [] });
    } else {
      const data = results.map(result => Object.keys(result).map(value => result[value]));
      const headers = Object.keys(results[0]);
      this.setState({ data, headers, error: '' });
    }
  };

  render() {
    return (
      <div style={{ textAlign: 'start' }}>
        <DropDownMenu
          floatingLabelText="Selected Database"
          value={this.state.selectedGraph}
          onChange={this.onDataSourceChange}
        >
          {this.state.graphContexts.map(
              graph => <MenuItem value={graph} primaryText={graph.name} />)}
        </DropDownMenu>
        <Divider />
        <CodeMirror
          options={{
            mode: 'sparql',
            lineNumbers: true,
            theme: 'material',
          }}
          name="sparql query editor"
          value={this.state.query}
          onChange={this.onQueryChange}
        />
        <FloatingActionButton
          style={{ right: '40px', top: '100px', position: 'absolute' }}
          onClick={this.onFireQuery}
        >
          <Play /></FloatingActionButton>
        <SparqlVisualizer
          data={this.state.data}
          headers={this.state.headers}
          error={this.state.error}
        />
      </div>
    );
  }
}

export default QueryWriter;

QueryWriter.propTypes = {
  executeQuery: PropTypes.func.isRequired,
  executeQueryInEnvironment: PropTypes.func.isRequired,
};
