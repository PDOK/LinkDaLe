/* eslint-disable react/jsx-no-bind,
react/forbid-prop-types,
react/jsx-filename-extension,
class-methods-use-this */
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import * as TurtleSerializer from 'rdf-serializer-n3';
import * as JsonLDSerializer from 'rdf-serializer-jsonld';
import * as NTriplesSerializer from 'rdf-serializer-ntriples';
import * as SPARQLSerializer from 'rdf-serializer-sparql-update';
import MenuItem from 'material-ui/MenuItem';
import { grey300 } from 'material-ui/styles/colors';
import PropTypes from 'prop-types';

class InfoBar extends Component {
  constructor() {
    super();
    this.state = {
      displayText: '',
      value: 0,

    };
  }

  shouldComponentUpdate(nextProps) {
    const graph = nextProps.graph;
    if (!graph) {
      return true;
    }
    if (this.props.graph !== graph) {
      const serializer = new TurtleSerializer();
      const text = '.turtle';
      const dataType = 'application/x-turtle';
      serializer.serialize(graph, (x, y) => {
      }).then((resultGraph, err) =>
                this.setState({
                  displayText: resultGraph,
                  error: err,
                }),
            );
      this.setState({
        text,
        dataType,
      });
      return true;
    }
    return true;
  }
  handleChange(event, value) {
    let serializer;
    let text;
    let dataType;
    switch (value) {
      case 3 :
        serializer = new SPARQLSerializer();
        text = '.txt';
        dataType = 'text/plain';
        break;
      case 1 :
        serializer = new JsonLDSerializer();
        text = '.json';
        dataType = 'application/json-ld';
        break;
      case 2 :
        serializer = new NTriplesSerializer();
        text = '.txt';
        dataType = 'text/plain';
        break;
      default :
        serializer = new TurtleSerializer();
        text = '.turtle';
        dataType = 'application/x-turtle';
        break;
    }
    serializer.serialize(this.props.graph, (x, y) => {
    }).then((graph, err) =>
        this.setState({
          displayText: graph,
          error: err,
        }),
    );
    this.setState({
      text,
      dataType,
      value,
    });
    this.forceUpdate();
  }

  renderText(output) {
    let text = output;
    if (!text) {
      return <p>Generating output</p>;
    }
    if (typeof text === 'object') {
      text = JSON.stringify(text);
    }
    return (
      <div style={{
        background: grey300,
        marginRight: '50px',

      }}
      >
        {text.split('\n').map((value, idx) =>
// eslint-disable-next-line react/no-array-index-key
          <p key={idx} style={{ margin: '0' }}>{value}</p>,
          )}
      </div>
    );
  }

  renderProgress() {
    if (this.props.processing) {
      return (
        <CircularProgress
          style={{
            margin: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
          size={100}
        />
      );
    }
    return <div />;
  }

  render() {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100%', height: '100%' }}>
        <Paper>
          <div style={{ width: '100%%' }}>
            <div style={{ width: '100%' }}>
              <RaisedButton
                label="download"
                href={`data:${this.state.dataType};charset=utf-8,${encodeURIComponent(this.state.displayText)}`}
                download={`dataset${this.state.text}`}
                disabled={this.props.processing}
                style={{
                  margin: '30px',
                  width: '40%',
                  float: 'left',

                }}
              />
            </div>
            <div style={{ width: '100%' }}>
              <RaisedButton
                label="publish"
                disabled
                style={{
                  margin: '30px',
                  width: '40%',
                  float: 'right',

                }}
              />
            </div>

          </div>
          <div style={
          {
            paddingTop: '90px',
            minHeight: '700px',
            paddingLeft: '50px',
          }
                    }
          >
            <SelectField
              floatingLabelText="Frequency"
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
            >
              <MenuItem value={0} primaryText="Turtle" />
              <MenuItem value={1} primaryText="JSON-LD" />
              <MenuItem value={2} primaryText="N-Triples" />
              <MenuItem value={3} primaryText="SPARQL" />
            </SelectField>
            <br />
            {this.renderText(this.state.displayText)}
            {this.renderProgress()}
            <p />
          </div>

        </Paper>
      </div>
    );
  }
}
InfoBar.propTypes = {
  graph: PropTypes.object,
  processing: PropTypes.bool.isRequired,
};
InfoBar.defaultProps = {
  graph: undefined,
};
export default InfoBar;
