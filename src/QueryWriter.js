/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/theme/material.css';

class QueryWriter extends React.Component {
  constructor() {
    super();
    this.state = {
      query: 'SELECT ?s ?p ?o',
    };
  }

  render() {
    return (
      <div style={{
        textAlign: 'start',
      }}
      >
        <CodeMirror
          options={{
            mode: 'sparql',
            lineNumbers: true,
            theme: 'material',
          }}
          name="sparql query editor"
          value={this.state.query}
        />
      </div>
    );
  }
}

export default QueryWriter;

