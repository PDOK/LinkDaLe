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
import Highlight from 'react-highlight';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import 'highlight.js/styles/default.css';

class InfoBar extends Component {
  constructor() {
    super();
    const today = new Date();
    this.state = {
      displayText: '',
      value: 0,
      sparqlProcessing: false,
      date: `${today.getDate()}-${today.getMonth()}-${today.getYear()}`,
      dialog: {
        open: true,
      },
      snackbar: {
        open: false,
        message: 'hi i\'m a snackbar',
      },

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
      serializer.serialize(graph, () => {
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
  handleRequestClose() {
    const snackbar = this.state.snackbar;
    snackbar.open = false;
    this.setState({
      snackbar,
    });
  }
  handleChange(_, value) {
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
    serializer.serialize(this.props.graph, () => {
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
  sendSparqlInput() {
    const serializer = new NTriplesSerializer();
    serializer.serialize(this.props.graph, () => {
    }).then((graph, err) => {
      if (err) {
        console.error(err);
      } else {
        const query = `INSERT DATA { GRAPH <${this.props.filename}> {${graph}}}`;
        this.setState({ sparqlProcessing: true });
        this.props.executeQuery(query, this.sparqlCallback.bind(this));
      }
    });
  }
  sparqlCallback(err, results) {
    console.log(results);
    if (err) {
      console.error(err);
      const snackbar = this.state.snackbar;
      snackbar.open = true;
      snackbar.message = 'An error has occurred while storing your data-set';
      this.setState({ sparqlProcessing: false,
        snackbar });
    } else {
      const snackbar = this.state.snackbar;
      snackbar.open = true;
      snackbar.message = 'Data-set successfully stored';
      this.setState({ sparqlProcessing: false,
        snackbar });
    }
  }

  renderText(output) {
    if (!output) {
      return <p>Generating output</p>;
    }
    if (typeof output === 'object') {
      return <Highlight className="json">{JSON.stringify(output, null, 2)}</Highlight>;
    }
    return (
      <Highlight className="xml">{output}</Highlight>
    );
  }


  renderProgress() {
    if (this.props.processing || this.state.sparqlProcessing) {
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
                download={`${this.props.filename}${this.state.text}`}
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
                disabled={this.state.displayText === ''}
                onClick={this.sendSparqlInput.bind(this)}
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
            paddingRight: '50px',
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
        <Dialog open={this.state.dialog.open}>
          <form>
            <label htmlFor="filename">
              Dataset name:<br />
              <input name="filename" value={this.props.filename} disabled />
            </label>
            <br />
            <label htmlFor="title">
              Title:<br />
              <input type="text" name="title" />
            </label>
            <br />
            <label htmlFor="description">
              Description:<br />
              <textarea name="description" type="text" rows="5" />
            </label>
            <br />
            <label htmlFor="date">Created on:<br />
              <input type="date" name="date" value={this.state.date} disabled />
            </label>
            (// TODO: Add locale support)
          </form>
        </Dialog>

        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose.bind(this)}
        />
      </div>
    );
  }
}
InfoBar.propTypes = {
  graph: PropTypes.object,
  processing: PropTypes.bool.isRequired,
  executeQuery: PropTypes.func.isRequired,
  filename: PropTypes.string,
};
InfoBar.defaultProps = {
  graph: undefined,
  filename: undefined,
};
export default InfoBar;
