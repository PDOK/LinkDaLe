/**
 * Created by Gerwin Bosch on 6-7-2017.
 */
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import GraphView from 'react-digraph';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { green500 } from 'material-ui/styles/colors';
import ActionSearch from 'material-ui/svg-icons/action/search';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';
import 'whatwg-fetch';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Info from 'material-ui/svg-icons/action/info-outline';

function doNothing() {

}

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
      typeText: 'class',
      shapeId: '#uri',
      shape: (
        <symbol viewBox="0 0 100 100" id="uri" key="1">
          <circle cx="50" cy="50" r="45" />
        </symbol>

      ),
    },
    literal: {
      typeText: 'raw value',
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


class DataLinkView extends Component {
  constructor() {
    super();
    this.state = {
      // nodes: props.data.nodes,
      // links: props.data.links,
      selected: {},
      dialog: {
        open: false,
        results: [],
        vocabPickerIndex: 0,
        lovAvailable: true,
      },
      infoDialog: { open: false },
    };
  }

  componentDidMount() {
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) { this.forceUpdate(); }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const nodes = nextProps.nodes;
    const links = nextProps.links;
    if (this.props.nodes !== nodes || this.props.links !== links) {
      return true;
    }
    if (this.state.selected !== nextState.selected) {
      this.setState(nextState.selected);
      return true;
    }
    return true;
  }

  onChange = (object, string) => {
    const dialog = this.state.dialog;
    dialog.searchText = string;
    this.setState({ dialog });
  };

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  onUpdateNode = (viewNode) => {
    const i = this.getNodeIndex(viewNode);
    this.props.setNode(i, viewNode);
  };
  // Edge 'mouseUp' handler
  onSelectEdge = (viewEdge) => {
    const target = this.getNode(viewEdge.target).label;
    const origin = this.getNode(viewEdge.source).label;

    this.setState({
      selected: viewEdge,
      relations: [
        {
          subject: origin,
          relation: viewEdge.relation,
          object: target,
        }],
    });
  };

  // Node 'mouseUp' handler
  onSelectNode = (viewNode) => {
    // Deselect events will send Null viewNode
    if (viewNode !== null) {
      const edges = [];
      for (let i = 0; i < this.props.links.length; i += 1) {
        const item = this.props.links[i];
        let origin;
        let target;
        if (item.source === viewNode.id) {
          origin = viewNode.label;
          target = this.getNode(item.target).label;
          edges.push({
            subject: origin,
            relation: item.relation,
            object: target,
          });
        } else if (item.target === viewNode.id) {
          origin = this.getNode(item.target).label;
          target = viewNode.label;
          edges.push({
            subject: origin,
            relation: item.relation,
            object: target,
          });
        }
      }
      this.setState({ selected: viewNode, relations: edges });
    } else {
      this.setState({ selected: {}, relations: [] });
    }
  };
  // Creates a new node between two edges
  onCreateEdge = (sourceViewNode, targetViewNode) => {
    if (sourceViewNode === targetViewNode) {
      return;
    }
    if (sourceViewNode.type === 'literal') {
      return;
    }
    const dialog = this.state.dialog;
    dialog.open = true;
    dialog.source = sourceViewNode[NODE_KEY];
    dialog.target = targetViewNode[NODE_KEY];
    this.setState({
      dialog,
    });
    this.forceUpdate();
  };

  // Called when an edge is reattached to a different target.
  onSwapEdge = (sourceViewNode, targetViewNode, viewEdge) => {
    const edges = this.props.links;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    edges[i] = edge;

    this.setState({ links: edges });
  };
  // Called when an edge is deleted
  onDeleteEdge = (viewEdge) => {
    const i = this.getEdgeIndex(viewEdge);
    this.props.deleteEdge(i, viewEdge);
    this.setState({
      selected: {},
    });
  };
  onVocabPicked = (_, index) => {
    const dialog = this.state.dialog;
    dialog.vocabPickerIndex = index;
    this.setState({
      dialog,
    });
  };
  onUriChange = (_, string) => {
    const dialog = this.state.dialog;
    dialog.vocabDownText = string;
    this.setState({ dialog });
  };


  // Helper to find the index of a given node
  getNodeIndex(searchNode) {
    return this.props.nodes.findIndex(node => node[NODE_KEY] === searchNode[NODE_KEY]);
  }

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge) {
    return this.props.links.findIndex(edge => edge.source === searchEdge.source &&
          edge.target === searchEdge.target);
  }

  // Given a nodeKey, return the corresponding node
  getViewNode = (nodeKey) => {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.props.nodes[i];
  };

  /*
   * Handlers/Interaction
   */

  getNode(id) {
    for (let i = 0; i < this.props.nodes.length; i += 1) {
      if (this.props.nodes[i].id === id) {
        return this.props.nodes[i];
      }
    }
    return undefined;
  }

  toNextPage() {
    this.props.nextPage();
  }


  toPreviousPage() {
    this.props.previousPage(2);
  }


  searchVocabulary = (e) => {
    const query = this.state.dialog.searchText;
    const dialog = this.state.dialog;
    e.preventDefault();
    fetch(`http://lov.okfn.org/dataset/lov/api/v2/term/search?q=${query
    }&type=property`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response);
        }
        return response.json();
      })
      .then((json) => {
        dialog.results = json.results.map(
          item => ({
            uri: item.uri[0],
            vocabPrefix: item['vocabulary.prefix'][0],
            prefix: item.prefixedName[0],
          }),
        );
        if (dialog.results.length === 0) {
          dialog.error = 'No results found';
        }
        dialog.lovAvailable = true;
        this.setState({ dialog });
      })
      .catch((ex) => {
        if (ex.statusText) {
          dialog.error = `Request failed due to ${ex}`;
        } else {
          dialog.error = 'LOV is currently not available';
          dialog.lovAvailable = false;
        }
        console.error('parsing failed', ex);
        this.setState(dialog);
      });
  };


  handlePick = () => {
    const dialog = this.state.dialog;
    let result;
    let name;
    if (this.state.dialog.lovAvailable) {
      result = dialog.results[dialog.vocabPickerIndex];
      name = result.prefix.split(':')[1];
    } else {
      name = this.state.dialog.vocabDownText;
      name = name.toLowerCase();
      name = name.replace(/ /g, '_');
      result = {
        uri: name,
        name,
        prefix: name,
      };
    }
    const newEdge = {
      source: this.state.dialog.source,
      target: this.state.dialog.target,
      relation: result.prefix,
      r: 30,
      type: 'emptyEdge',
      title: name,
      link: result.uri,
      vocabPrefix: result.vocabPrefix,
      prefix: result.prefix,
    };
    this.props.pushEdge(newEdge);
    dialog.open = false;
    dialog.results = [];
    this.setState({
      dialog,
    });
    this.forceUpdate();
  };

  handleClose = () => {
    const dialog = this.state.dialog;
    dialog.open = false;
    dialog.results = [];
    dialog.vocabPickerIndex = 0;
    this.setState({
      dialog,
    });
    this.forceUpdate();
  };
  renderDialogTableBody() {
    if (!this.state.dialog.lovAvailable) {
      return (<TextField
        name="Relation URI"
        hintText="The relation of the URI"
        onChange={this.onUriChange}
      />);
    }
    if (this.state.dialog.results.length) {
      const result = this.state.dialog.results.map((column, index) =>
        (<MenuItem
          key={column.prefix}
          value={index}
          label={column.prefix}
          primaryText={column.prefix}
        />));
      return (
        <DropDownMenu
          value={this.state.dialog.vocabPickerIndex}
          onChange={this.onVocabPicked}
          openImmediately
        >
          {result}
        </DropDownMenu>
      );
    }
    return <div />;
  }


  renderGraph() {
    const nodes = this.props.nodes;
    const edges = this.props.links;
    const selected = this.state.selected;

    const NodeTypes = GraphConfig.NodeTypes;
    const NodeSubtypes = GraphConfig.NodeSubtypes;
    const EdgeTypes = GraphConfig.EdgeTypes;
    if (this.props.nodes.length > 0) {
      return (
        <GraphView
          style={
            {
              height: window.innerHeight - 190,
              flex: '0 0 85%',
            }
          }
          primary={green500}
          // eslint-disable-next-line react/no-string-refs
          ref="GraphView"
          nodeKey={NODE_KEY}
          emptyType={EMPTY_TYPE}
          nodes={nodes}
          edges={edges}
          selected={selected}
          nodeTypes={NodeTypes}
          nodeSubtypes={NodeSubtypes}
          edgeTypes={EdgeTypes}
          getViewNode={this.getViewNode}
          onSelectNode={this.onSelectNode}
          onUpdateNode={this.onUpdateNode}
          onSelectEdge={this.onSelectEdge}
          onCreateEdge={this.onCreateEdge}
          onSwapEdge={this.onSwapEdge}
          onDeleteEdge={this.onDeleteEdge}
          onDeleteNode={doNothing}
          onCreateNode={doNothing}
        />
      );
    }
    return <div />;
  }

  render() {
    const selected = this.state.selected;

    const actions = [
      <FlatButton
        label={'Finish'}
        primary
        onClick={this.handlePick}
        disabled={!(this.state.dialog.results.length !== 0 || this.state.dialog.vocabDownText)}
      />,

      <FlatButton
        label="Cancel"
        onClick={this.handleClose}
      />,
    ];

    return (

      <div>
        <Paper zDepth={2}>
          <div style={{ width: '100%', display: 'inline-block' }}>
            <FlatButton
              label="return"
              onClick={() => this.toPreviousPage()}
              style={{
                margin: 14,
              }}
            />
            <FlatButton
              label="continue"
              onClick={() => this.toNextPage()}
              style={{
                float: 'right',
                margin: 14,
              }}
            />
          </div>

        </Paper>
        <div style={{ display: 'flex' }}>
          {this.renderGraph()}
          <InfoBar
            selected={selected}
            references={this.state.relations}
            getData={this.props.getExampleData}
          />
          <FloatingActionButton
            style={{
              position: 'absolute',
              right: '256px',
              bottom: '8px',
            }}
            onClick={() => this.setState({ infoDialog: { open: true } })}
          ><Info /></FloatingActionButton>


        </div>
        <Dialog
          actions={actions}
          modal
          open={this.state.dialog.open}
        >

          <div style={{ width: '100%' }}>
            <p>This dialog allows specifying relationships between data items that was linked.
                In RDF this is called a predicate.</p>
            <p>For example, <em> foaf:age </em> can be used to link a person to his/her age</p>
            <form onSubmit={this.searchVocabulary}>
              <TextField
                name="Search vocabularies"
                hintText="relation name"
                onChange={this.onChange}
                errorText={this.state.dialog.error}
              />
              <IconButton type="submit"><ActionSearch /></IconButton>
            </form>
            <p>Provide a relation name in the field above and pick a term from the suggestions</p>
            <p> <em> Similar terms can be found in different vocabularies
                therefore try to use as few vocabularies as possible</em></p>
            {this.renderDialogTableBody()}
          </div>

        </Dialog>
        <Dialog
          open={this.state.infoDialog.open}
          onRequestClose={() => this.setState({ infoDialog: { open: false } })}
          title="controls"
        >
              Click: Select node/edge<br />
              Click, hold and drag a node: Drag the node<br />
              Shift+Click a node and drag: Create new Edge<br />
              Click on an Edge and press Del: Delete the Edge<br />

        </Dialog>

      </div>
    );
  }
}
function InfoBar(props) {
  const item = props.selected;
  let text;
  if (item.type === 'literal') {
    text = (<CardText><p>ColumnName: {item.title}</p></CardText>);
  } else if (item.type === 'uri') {
    text = (
      <CardText style={{ textOverflow: 'ellipsis' }}>
        <p>
          Class: <a href={item.uri} target="_blank" rel="noopener noreferrer">{item.label}</a><br />
          Ontology: {item.title}<br />
          Prefix: {item.prefixedName}
        </p>
      </CardText>);
  } else if (item.type === 'emptyEdge') {
    text = (
      <p>
        Property: <a href={item.link} target="_blank" rel="noopener noreferrer">{item.relation}</a><br />
        Ontology: {item.prefix}<br />
        Prefix: {item.vocabPrefix}<br />
      </p>);
  }
  let middleCard = <div />;
  if (item.type !== 'emptyEdge') {
    middleCard = props.getData(item.column, 0).results.map((x, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <CardText key={idx} style={{ textOverflow: 'ellipsis' }}>
        {x}
        <Divider />
      </CardText>
    ));
  } else if (props.references && props.references.length > 0) {
    middleCard = (
      <Card>
        <CardHeader
          title="References"
          subtitle="Click to expand"
          actAsExpander
          showExpandableButton
        />
        {
          props.references.map(relation =>
            (<CardText key={relation.subject} style={{ textOverflow: 'ellipsis' }} expandable>
              <Divider />
              <p>
                <b>Subject: </b>{relation.subject}<br />
                <b>Relation: </b>{relation.relation}<br />
                <b>Object: </b>{relation.object}<br />
              </p>
            </CardText>),
          )
        }
      </Card>
    );
  }
  return (
    <Card style={{ width: '256px', maxWidth: '256px' }}>
      <Card>
        <CardText>
          {text}
        </CardText>
      </Card>
      {middleCard}
    </Card>
  );
}

DataLinkView.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
  setNode: PropTypes.func.isRequired,
  deleteEdge: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  pushEdge: PropTypes.func.isRequired,
  getExampleData: PropTypes.func.isRequired,
};
InfoBar.propTypes = {
  selected: PropTypes.objectOf(PropTypes.any),
  getData: PropTypes.func.isRequired,
  references: PropTypes.arrayOf(PropTypes.object),
};

InfoBar.defaultProps = {
  references: [],
  selected: undefined,
};


export default DataLinkView;
