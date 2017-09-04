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
import TripleVisualizer from './TripleVisualizer';
import { getDefaultGraph } from './querybuilder';

class QueryWriter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: 'SELECT ?s ?p ?o',
      data: [],
      graphContexts: [],
      selectedGraph: {},
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
        const graphData = Object.keys(currentstore).map(
            item => ({ name: currentstore[item]['http://purl.org/dc/terms/title'], uri: item }));
        this.setState({ graphContexts: graphData });
      }
    });
  }
  onDataSourceChange = (event, index, value) => {
    console.log(value);
    this.setState({ selectedGraph: value });
  }

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
        />
        <FloatingActionButton style={{ right: '40px', top: '100px', position: 'absolute' }}><Play /></FloatingActionButton>
        <TripleVisualizer data={this.state.data} />
      </div>
    );
  }
}

export default QueryWriter;

QueryWriter.propTypes = {
  executeQuery: PropTypes.func.isRequired,
};

