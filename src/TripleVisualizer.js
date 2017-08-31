/* eslint-disable react/forbid-prop-types,react/jsx-filename-extension */
import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import PropTypes from 'prop-types';
import GraphView from 'react-digraph';
import { green500 } from 'material-ui/styles/colors';
import { distribute } from './Dataprocessing';

const GraphConfig = {
  NodeTypes: {
    empty: {
      typeText: 'None',
      shapeId: '#empty',
      shape: (
        <symbol viewBox="0 0 100 100" id="empty" key="0">
          <circle cx="50" cy="50" r="45" />
        </symbol>
      ),
    },
    uri: {
      typeText: 'URI',
      shapeId: '#uri',
      shape: (
        <symbol viewBox="0 0 100 100" id="uri" key="1">
          <circle cx="50" cy="50" r="45" />
        </symbol>

      ),
    },
    literal: {
      typeText: 'Literal',
      shapeId: '#literal',
      shape: (<symbol viewBox="0 0 50 50" id="literal" key="2">
        <rect width="45" height="45" />
      </symbol>
      ),
    },

  },
  NodeSubtypes: {},
  EdgeTypes: {
    emptyEdge: {
      shapeId: '#emptyEdge',
      typeText: 'Literal',
      shape: (
        <symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
          <circle cx="25" cy="25" r="8" fill="currentColor" />
        </symbol>
      ),
    },
  },
};
const NODE_KEY = 'id'; // Key used to identify nodes

// These keys are arbitrary (but must match the config)
// However, GraphView renders text differently for empty types
// so this has to be passed in if that behavior is desired.
const EMPTY_TYPE = 'empty'; // Empty node type

class TripleVisualizer extends React.Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      edges: [],

    };
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps === this.props && nextState === this.state) {
      return false;
    }
    this.dataToNodes();
    return true;
  }
  onUpdateNode(viewNode) {
    const i = this.getNodeIndex(viewNode);
    const nodes = this.state.nodes;
    nodes[i] = viewNode;
    this.setState(nodes);
  }

  // Helper to find the index of a given node
  getNodeIndex = searchNode => this.state.nodes.findIndex(
      node => node[NODE_KEY] === searchNode[NODE_KEY]);

  // Helper to find the index of a given edge
  getEdgeIndex = searchEdge =>
      this.state.edges.findIndex(edge => edge.source === searchEdge.source &&
        edge.target === searchEdge.target);

  // Given a nodeKey, return the corresponding node
  getViewNode = (nodeKey) => {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.state.nodes[i];
  };

  dataToNodes = () => {
    // Subject, Predicate, Object
    // Nodes = {Subject}, {Object}
    // Edges  = {o:s d:o t:Predicate}
    // id label type r title column
    let nodes = [];
    const edges = [];
    console.log(this.props.data);
    if (this.props.data.length > 0) {
      this.props.data.forEach((ontology) => {
        let subject = nodes.find(node => node.title === ontology[0].value);
        if (!subject) {
          subject = {
            id: (nodes.length),
            label: ontology[0].value,
            r: 15,
            title: ontology[0].value,
            type: 'uri', // Subjects are always URI's
          };
          nodes.push(subject);
        }
        let object = nodes.find(node => node.title === ontology[2].value);
        if (!object) {
          object = {
            id: (nodes.length),
            label: ontology[2].value,
            r: 15,
            title: ontology[2].value,
            type: ontology[2].token,
          };
          nodes.push(object);
        }
        edges.push({
          source: subject.id,
          target: object.id,
          label: ontology[1].value,
          type: 'emptyEdge',
        });
      });
      nodes = distribute(nodes);
    }
    this.setState({
      nodes,
      edges,
    });
  }
  dataToClasses = () => {

  }
  doNothing = () => {};


  render() {
    console.log(this.state.nodes);
    return (
      <Tabs>
        <Tab label="Table">
          <Table selectable={false} wrapperStyle={{ maxHeight: '50vh' }}>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Subject</TableHeaderColumn>
                <TableHeaderColumn>Predicate</TableHeaderColumn>
                <TableHeaderColumn>Predicate</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
              style={{ maxHeight: '20vh' }}
            >
              {this.props.data.map(row => (
                <TableRow>
                  <TableRowColumn>{row[0].value}</TableRowColumn>
                  <TableRowColumn>{row[1].value}</TableRowColumn>
                  <TableRowColumn>{row[2].value}</TableRowColumn>
                </TableRow>))}
            </TableBody>
          </Table>
        </Tab>
        <Tab label="Graph view">
          <GraphView
            style={
            {
              height: '50vh',
              flex: '0 0 85%',
            }
              }
            primary={green500}
              // eslint-disable-next-line react/no-string-refs
            ref="GraphView"
            nodeKey={NODE_KEY}
            emptyType={EMPTY_TYPE}
            nodes={this.state.nodes}
            edges={this.state.edges}
            selected={this.state.selected}
            nodeTypes={GraphConfig.NodeTypes}
            nodeSubtypes={GraphConfig.NodeSubtypes}
            edgeTypes={GraphConfig.EdgeTypes}
            getViewNode={this.getViewNode}
            onSelectNode={this.doNothing}
            onUpdateNode={this.doNothing}
            onSelectEdge={this.doNothing}
            onCreateEdge={this.doNothing}
            onSwapEdge={this.doNothing}
            onDeleteEdge={this.doNothing}
            onDeleteNode={this.doNothing}
            onCreateNode={this.doNothing}
          />

        </Tab>
      </Tabs>
    );
  }
}
TripleVisualizer.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TripleVisualizer;
