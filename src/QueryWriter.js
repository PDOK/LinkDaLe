/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import CodeMirror from 'react-codemirror';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Play from 'material-ui/svg-icons/av/play-arrow';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/theme/material.css';
import TripleVisualizer from './TripleVisualizer';

class QueryWriter extends React.Component {
  constructor() {
    super();
    this.state = {
      query: 'SELECT ?s ?p ?o',
      data: [],
    };
  }

  render() {
    return (
      <div style={{ textAlign: 'start' }}>
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

