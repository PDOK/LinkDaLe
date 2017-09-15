import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import PropTypes from 'prop-types';
import GraphView from 'react-digraph';
import { green500 } from 'material-ui/styles/colors';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import { distribute } from './dataprocessing';

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

const SUBJECT = 0;
const PREDICATE = 1;
const OBJECT = 2;


class TripleVisualizer extends React.Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      edges: [],
      classNodes: [],
      classEdges: [],
      selected: {},
      selectedClass: {},

    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.dataToNodes(nextProps.data);
      this.getClassfromData(nextProps.data);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(nextProps === this.props && nextState === this.state);
  }
  // Edge 'mouseUp' handler
  onSelectEdge = (viewEdge) => {
    this.setState({
      selected: viewEdge,
    });
  };
  // Edge 'mouseUp' handler
  onSelectClassEdge = (viewEdge) => {
    this.setState({
      selectedClass: viewEdge,
    });
  };

  // Node 'mouseUp' handler
  onSelectClassNode = (viewNode) => {
    // Deselect events will send Null viewNode
    if (viewNode !== null) {
      this.setState({ selectedClass: viewNode });
    } else {
      this.setState({ selectedClass: {} });
    }
  };

  // Node 'mouseUp' handler
  onSelectNode = (viewNode) => {
    // Deselect events will send Null viewNode
    if (viewNode !== null) {
      // const allRelations = this.state.edges.filter(
      //     edge => edge.source === viewNode.id || edge.target === viewNode.id);
      // const relations = allRelations.map(relation =>
      // `${this.getViewNode(relation.source).title} ${relation.label.split('/').pop()}
      // ${this.getViewNode(relation.target).title}`);
      this.setState({ selected: viewNode });
    } else {
      this.setState({ selected: {}, relations: [] });
    }
  };


  // Helper to find the index of a given node
  getNodeIndex = searchNode => this.state.nodes.findIndex(
    node => node[NODE_KEY] === searchNode[NODE_KEY]);

  // Given a nodeKey, return the corresponding node
  getViewNode = (nodeKey) => {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.state.nodes[i];
  };
  // Helper to find the index of a given node
  getNodeClassIndex = searchNode => this.state.classNodes.findIndex(
    node => node[NODE_KEY] === searchNode[NODE_KEY]);

  // Given a nodeKey, return the corresponding node
  getViewClassNode = (nodeKey) => {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeClassIndex(searchNode);
    return this.state.classNodes[i];
  };


  getClassfromData = (data) => {
    let nodes = [];
    const edges = [];
    const library = [];
    data.forEach((ontology) => {
      let node = library.find(classification => classification.value === ontology[SUBJECT].value);
      if (!node) {
        node = {
          value: ontology[SUBJECT].value,
          relations: [],
        };
        library.push(node);
      }
      if (ontology[PREDICATE].value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
        node.class = ontology[OBJECT].value;
      } else {
        node.relations.push(
          { classification: ontology[PREDICATE].value, target: ontology[OBJECT].value });
      }
    });
    library.forEach((classification) => {
      const classified = nodes.find(node => node.label === classification.class);
      if (!classified) {
        let shortTitle = classification.class;
        if (shortTitle.split('/').pop() &&
            !(shortTitle.split('/').pop() === '')) {
          shortTitle = classification.class.split('/').pop();
        }

        nodes.push({
          id: (nodes.length),
          title: shortTitle,
          r: 15,
          label: classification.class,
          type: 'uri',
          values: [classification.value],
        });
      } else {
        const idx = nodes.findIndex(node => node.id === classified.id);
        if (!classified.values.includes(classification.value)) {
          classified.values.push(classification.value);
        }
        nodes[idx] = classified;
      }
    });
    library.forEach((classification) => {
      const startNode = nodes.find(node => node.values.includes(classification.value));
      classification.relations.forEach((relation) => {
        let endNode = nodes.find(node => node.values.includes(relation.target));
        if (!endNode) {
          endNode = nodes.find(node => node.label === relation.classification);
          if (!endNode) {
            endNode = {
              id: (nodes.length),
              title: relation.classification.split('/').pop(),
              r: 15,
              label: relation.classification,
              type: 'literal',
              values: [],
            };
            nodes.push(endNode);
          }
        }
        edges.push({
          source: startNode.id,
          target: endNode.id,
          label: relation.classification,
          type: 'emptyEdge',
        });
      });
    });
    nodes = distribute(nodes);
    this.setState({ classNodes: nodes, classEdges: edges });
  };
  dataToNodes = (data) => {
    // Subject, Predicate, Object
    // Nodes = {Subject}, {Object}
    // Edges  = {o:s d:o t:Predicate}
    // id label type r title column
    let nodes = [];
    const edges = [];
    if (data.length > 0) {
      data.forEach((ontology) => {
        let subject = nodes.find(node => node.label === ontology[0].value);
        if (!subject) {
          let shortTitle = ontology[0].value;
          if (shortTitle.split('/').pop() &&
              !(shortTitle.split('/').pop() === '')) {
            shortTitle = ontology[0].value.split('/').pop();
          }

          subject = {
            id: (nodes.length),
            title: shortTitle,
            r: 15,
            label: ontology[0].value,
            type: 'uri', // Subjects are always URI's
          };
          nodes.push(subject);
        }
        let object = nodes.find(node => node.label === ontology[2].value);
        if (!object) {
          object = {
            id: (nodes.length),
            title: ontology[2].type === 'uri' ? ontology[2].value.split('/').pop() : ontology[2].value,
            r: 15,
            label: ontology[2].value,
            type: ontology[2].type === 'uri' ? 'uri' : 'literal',
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
    this.setState({ nodes, edges });
  };
  doNothing = () => {};
  renderCard = () => {
    let cardText = '';
    let title = '';
    let subtitle = '';
    if (this.state.selected) {
      if (this.state.selected.type === 'literal') {
        cardText = <p>{this.state.selected.label}</p>;
        title = this.state.selected.title;
        subtitle = 'Literal';
      } else if (this.state.selected.type === 'emptyEdge') {
        cardText = <a href={this.state.selected.label}>{this.state.selected.label}</a>;
        title = this.state.selected.label;
        subtitle = 'Reference';
      } else if (this.state.selected.type === 'uri') {
        cardText = <a href={this.state.selected.label}>{this.state.selected.label}</a>;
        title = this.state.selected.title;
        subtitle = 'URI';
      }
    }

    return (
      <Card style={{ position: 'absolute', right: '15px', bottom: '15px', width: 'fit-content', zIndex: '10' }}>
        <CardHeader
          title={title}
          subtitle={subtitle}
        />
        <CardText>
          {cardText}
        </CardText>
      </Card>
    );
  };
  renderClassCard = () => {
    let cardText = '';
    let title = '';
    let subtitle = '';
    if (this.state.selectedClass) {
      if (this.state.selectedClass.type === 'literal') {
        title = this.state.selectedClass.title;
        subtitle = 'Literal';
      } else if (this.state.selectedClass.type === 'emptyEdge') {
        title = this.state.selectedClass.label;
        subtitle = 'Reference';
      } else if (this.state.selectedClass.type === 'uri') {
        title = this.state.selectedClass.title;
        subtitle = 'URI';
      }
      cardText = <a href={this.state.selectedClass.label}>{this.state.selectedClass.label}</a>;
    }

    return (
      <Card style={{ position: 'absolute', right: '15px', bottom: '15px', width: 'fit-content', zIndex: '10' }}>
        <CardHeader
          title={title}
          subtitle={subtitle}
        />
        <CardText>
          {cardText}
        </CardText>
      </Card>
    );
  };
  render() {
    const renderErrorBox = this.props.error ? (
      <Tab label="Error">
        <Paper>
          <h1>Something went wrong</h1>
          {this.props.error}
        </Paper>
      </Tab>
    ) : (null);

    return (
      <Tabs>
        {renderErrorBox}
        <Tab label="Table" disabled={!!this.props.error}>
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
                <TableRow key={row[0].value + row[1].value + row[2].value}>
                  <TableRowColumn>{row[0].value}</TableRowColumn>
                  <TableRowColumn>{row[1].value}</TableRowColumn>
                  <TableRowColumn>{row[2].value}</TableRowColumn>
                </TableRow>))}
            </TableBody>
          </Table>
        </Tab>
        <Tab label="Data graph" style={{ position: 'relative' }} disabled={!!this.props.error}>
          <GraphView
            style={
              {
                height: '48vh',
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
            onSelectNode={this.onSelectNode}
            onUpdateNode={this.doNothing}
            onSelectEdge={this.onSelectEdge}
            onCreateEdge={this.doNothing}
            onSwapEdge={this.doNothing}
            onDeleteEdge={this.doNothing}
            onDeleteNode={this.doNothing}
            onCreateNode={this.doNothing}
          />
          {this.renderCard()}


        </Tab>
        <Tab label="Class graph" disabled={!!this.props.error}>
          <GraphView
            style={
              {
                height: '50vh',
              }
            }
            primary={green500}
            // eslint-disable-next-line react/no-string-refs
            ref="GraphView"
            nodeKey={NODE_KEY}
            emptyType={EMPTY_TYPE}
            nodes={this.state.classNodes}
            edges={this.state.classEdges}
            selected={this.state.selectedClass}
            nodeTypes={GraphConfig.NodeTypes}
            nodeSubtypes={GraphConfig.NodeSubtypes}
            edgeTypes={GraphConfig.EdgeTypes}
            getViewNode={this.getViewClassNode}
            onSelectNode={this.onSelectClassNode}
            onUpdateNode={this.doNothing}
            onSelectEdge={this.onSelectClassEdge}
            onCreateEdge={this.doNothing}
            onSwapEdge={this.doNothing}
            onDeleteEdge={this.doNothing}
            onDeleteNode={this.doNothing}
            onCreateNode={this.doNothing}
          />
          {this.renderClassCard()}

        </Tab>
      </Tabs>
    );
  }
}
TripleVisualizer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  error: PropTypes.string,
};

TripleVisualizer.defaultProps = {
  error: '',
};

export default TripleVisualizer;
