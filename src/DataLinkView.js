/**
 * Created by Gerwin Bosch on 6-7-2017.
 */
import React, {Component} from 'react';
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import GraphView from 'react-digraph'
import {Card, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {green500,green700,green400, orangeA200} from 'material-ui/styles/colors'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import ActionSearch from 'material-ui/svg-icons/action/search';
import Dialog from 'material-ui/Dialog';
import 'whatwg-fetch'
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'

const GraphConfig = {
    NodeTypes: {
        empty: {
            typeText: "None",
            shapeId: "#empty",
            shape: (
                <symbol viewBox="0 0 100 100" id="empty" key="0">
                    <circle cx="50" cy="50" r="45"></circle>
                </symbol>

            )
        },

        uri: {
            typeText: "URI",
            shapeId: "#uri",
            shape: (
                <symbol viewBox="0 0 100 100" id="uri" key="1">
                    <circle cx="50" cy="50" r="45"></circle>
                </symbol>

            )
        },
        literal: {
            typeText: "Literal",
            shapeId: "#literal",
            shape: (<symbol viewBox='0 0 50 50' id="literal" key="2">
                    <rect margin='2.5px' width='45' height='45'></rect>
                </symbol>
            )
        }

    },
    NodeSubtypes: {},
    EdgeTypes: {
        emptyEdge: {
            shapeId: "#emptyEdge",
            typeText: "Literal",
            shape: (
                <symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
                    <circle cx="25" cy="25" r="8" fill="currentColor"></circle>
                </symbol>
            )
        }
    }
};
const NODE_KEY = "id"; // Key used to identify nodes

// These keys are arbitrary (but must match the config)
// However, GraphView renders text differently for empty types
// so this has to be passed in if that behavior is desired.
const EMPTY_TYPE = "empty"; // Empty node type
const SPECIAL_TYPE = "special";
const SPECIAL_CHILD_SUBTYPE = "specialChild";
const EMPTY_EDGE_TYPE = "emptyEdge";
const SPECIAL_EDGE_TYPE = "specialEdge";


class InfoBar extends Component {
    renderHeader(){
        const item = this.props.selected;
        let title = 'No item selected' ,
            subTitle = 'click on an item to select it';
        if (item.type === 'literal'||item.type === 'uri') {
            title = item.label;
            subTitle = 'node'
        } else if(this.props.selected.type === 'emptyEdge') {
            title = item.title;
            subTitle = 'relation'
        }
        return (
            <CardHeader
                title={title}
                subtitle={subTitle}
            />)
    }
    renderText(){
        const item = this.props.selected;
        let text;
        if(item.type === 'literal') {
            text = <p>Raw Value</p>
        } else if (item.type === 'uri') {
            text = <a href={item.class.uri} target="_blank">{item.class.prefix}</a>
        } else if (item.type === 'emptyEdge') {
            text = <a href={item.link} target="_blank">{item.relation}</a>
        }

        return(
        <CardText>
            {text}
        </CardText>
        )
    }
    renderReferences(){
        if(this.props.references && this.props.references.length > 0) {
            console.log(this.props.references);
            return (
                <Card>
                    <CardHeader
                        title="References"
                        subtitle="Click to expand"
                        actAsExpander={true}
                        showExpandableButton={true}

                    />
                    {
                        this.props.references.map((item) =>
                            <CardText expandable={true}>
                                <Divider/>
                                <p>
                                    <b>Subject: </b>{item.subject}<br/>
                                    <b>Relation:    </b>{item.relation}<br/>
                                    <b>Object:  </b>{item.object}<br/>
                                </p>
                            </CardText>

                        )
                    }
                </Card>
            )
        }
    }
    shouldComponentUpdate(){
        return true;
    }
    render() {
        return (
            <div style={{
                float:'right',
                height:'100%',
                width:'256px'
            }}>
                <Card>
                    {this.renderHeader()}
                    {this.renderText()}
                    {this.renderReferences()}
                    <Card>
                        <CardHeader
                            title="Controls"
                            subtitle="Click to expand"
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            Click: Select node/edge<br/>
                            Click and hold on node: Drag the node<br/>
                            Shift+Click a node and drag: Create new Edge<br/>
                        </CardText>
                    </Card>

                </Card>


            </div>
        )
    }
}
class DataLinkView extends Component {
    constructor(props) {
        super();
        this.state = {
            // nodes: props.data.nodes,
            // links: props.data.links,
            selected: {},
            dialog:{
                open:false
            }
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        const nodes = nextProps.nodes;
        const links = nextProps.links;
        console.log(nextProps.nodes);
        console.log(this.props.nodes);
        if (this.props.nodes !== nodes || this.props.links !== links) {
            return true;
        }
        if (this.state.selected !== nextState.selected){
            this.setState(nextState.selected);
            return true;
        }
        console.log("render","no render");
        return true;

    }

    componentDidMount() {
        this.forceUpdate();
    }
    getData() {
        return ({
            nodes: this.props.data.nodes,
            links: this.props.data.links
        })
    }

    toPreviousPage() {
        this.props.previousPage(2);
    }

    toNextPage() {
        this.props.nextPage();
    }

    // Helper to find the index of a given node
    getNodeIndex(searchNode) {
        return this.props.nodes.findIndex((node) => {
            return node[NODE_KEY] === searchNode[NODE_KEY]
        })
    }

    // Helper to find the index of a given edge
    getEdgeIndex(searchEdge) {
        return this.props.links.findIndex((edge) => {
            return edge.source === searchEdge.source &&
                edge.target === searchEdge.target
        })
    }

    // Given a nodeKey, return the corresponding node
    getViewNode(nodeKey) {
        const searchNode = {};
        searchNode[NODE_KEY] = nodeKey;
        const i = this.getNodeIndex(searchNode);
        return this.props.nodes[i]
    }

    /*
     * Handlers/Interaction
     */

    // Called by 'drag' handler, etc..
    // to sync updates from D3 with the graph
    onUpdateNode(viewNode) {
        const i = this.getNodeIndex(viewNode);
        this.props.setNode(i,viewNode)
    }
    getNode(id){
        for(let i = 0 ; i < this.props.nodes.length ; i++){
            if(this.props.nodes[i].id === id){
                return this.props.nodes[i];
            }
        }
    }

    // Node 'mouseUp' handler
    onSelectNode(viewNode) {
        // Deselect events will send Null viewNode
        if (viewNode !== null) {
            let edges = [];
            for(let i = 0; i < this.props.links.length ; i++){
                let item = this.props.links[i];
                let origin;
                let target;
                if(item.source === viewNode.id){
                    origin = viewNode.label;
                    console.log(origin);
                    console.log(this.getNode(item.target));
                    target = this.getNode(item.target).label;
                    edges.push({
                        subject:origin,
                        relation:item.relation,
                        object:target,
                    })
                } else if(item.target === viewNode.id){
                    origin = this.getNode(item.target).label;
                    target = viewNode.label;
                    edges.push({
                        subject:origin,
                        relation:item.relation,
                        object:target,
                    })
                }
            }
            console.log('relations',edges);
            this.setState({selected: viewNode, relations:edges});
            console.log('new selected',viewNode)
        } else {
            this.setState({selected: {}, relations: []});
            console.log('Removed',viewNode)

        }
    }

    // Edge 'mouseUp' handler
    onSelectEdge(viewEdge) {
        console.log('Edge selected',viewEdge);
        let target = this.getNode(viewEdge.target).label;
        let origin = this.getNode(viewEdge.source).label;

        this.setState({selected: viewEdge,
            relations:[{
                subject:origin,
                relation:viewEdge.relation,
                object:target
            }]
        });
    }

    // Creates a new node between two edges
    onCreateEdge(sourceViewNode, targetViewNode) {
        const edges = this.props.links;

        // This is just an example - any sort of logic
        // could be used here to determine edge type
        const type = sourceViewNode.type === SPECIAL_TYPE ? SPECIAL_EDGE_TYPE : EMPTY_EDGE_TYPE;

        if (sourceViewNode == targetViewNode) {
            return
        }

        // const viewEdge = {
        //     source: sourceViewNode[NODE_KEY],
        //     target: targetViewNode[NODE_KEY],
        //     type: type
        // }
        // edges.push(viewEdge);
        this.setState({dialog: {
            open:true,
            source: sourceViewNode[NODE_KEY],
            target: targetViewNode[NODE_KEY]
        }});
        this.forceUpdate()
    }
    searchVocabulary(){
        let query = this.state.dialog.searchText;
        let dialog = this.state.dialog;
        fetch('http://lov.okfn.org/dataset/lov/api/v2/term/search?q='+query+'&type=property')
            .then(function(response) {
                return response.json()
            }).then(function(json) {
            console.log('parsed json', json.results);
            dialog.results=json.results.map(
                function(item) {
                    return {
                        uri: item.uri[0],
                        vocabPrefix: item['vocabulary.prefix'][0],
                        prefix:item.prefixedName[0]
                    };
                }
            );
            this.setState({dialog:dialog});
            this.forceUpdate();
        }.bind(this)).catch(function(ex) {
            console.log('parsing failed', ex)
        })
    }

    // Called when an edge is reattached to a different target.
    onSwapEdge(sourceViewNode, targetViewNode, viewEdge) {
        const edges = this.props.links;
        const i = this.getEdgeIndex(viewEdge);
        const edge = JSON.parse(JSON.stringify(edges[i]));

        edge.source = sourceViewNode[NODE_KEY];
        edge.target = targetViewNode[NODE_KEY];
        edges[i] = edge;

        this.setState({links: edges});
    }

    // Called when an edge is deleted
    onDeleteEdge(viewEdge) {
        const i = this.getEdgeIndex(viewEdge);
        this.props.deleteEdge(i,viewEdge)
        this.setState({
            selected: {}
        })
    }
    renderDialogTableBody(){
        if(this.state.dialog.results){
            return this.state.dialog.results.map((column,index) =>
                <TableRow key={index}>
                    <TableRowColumn>{column.vocabPrefix}</TableRowColumn>
                    <TableRowColumn><a href={column.uri}>{column.uri}</a></TableRowColumn>
                    <TableRowColumn>{column.prefix}</TableRowColumn>
                    <TableRowColumn><RaisedButton onClick={() => this.handlePick(index)}>pick</RaisedButton></TableRowColumn>
                </TableRow>
            )

        }

    }
    doNothing(){};
    handlePick(index){
        let dialog = this.state.dialog;
        let result = dialog.results[index];
        console.log('resulte',result)
        let newEdge = {
            source:this.state.dialog.source,
            target:this.state.dialog.target,
            relation:result.prefix,
            r:30,
            type: "emptyEdge",
            title: result.vocabPrefix,
            link: result.uri,

        };
        this.props.pushEdge(newEdge);
        this.setState({
            dialog:{
                open:false,
            }
        });
        this.forceUpdate()
    }
    handleClose() {
        this.setState({
            dialog: {open: false}
        });
        this.forceUpdate()
    }
    onChange(object, string){
        let dialog = this.state.dialog;
        dialog.searchText=string;
        this.setState({dialog:dialog});
    }
    renderGraph(){
        const nodes = this.props.nodes;
        const edges = this.props.links;
        const selected = this.state.selected;

        const NodeTypes = GraphConfig.NodeTypes;
        const NodeSubtypes = GraphConfig.NodeSubtypes;
        const EdgeTypes = GraphConfig.EdgeTypes;
        console.log('nodes',this.props.nodes)
        if(this.props.nodes.length > 0) {
            return (
                <GraphView
                    style={
                        {
                            height: window.innerHeight - 190,
                            flex: '0 0 85%'
                        }
                    }
                    primary={green500}
                    ref='GraphView'
                    nodeKey={NODE_KEY}
                    emptyType={EMPTY_TYPE}
                    nodes={nodes}
                    edges={edges}
                    selected={selected}
                    nodeTypes={NodeTypes}
                    nodeSubtypes={NodeSubtypes}
                    edgeTypes={EdgeTypes}
                    getViewNode={this.getViewNode.bind(this)}
                    onSelectNode={this.onSelectNode.bind(this)}
                    onUpdateNode={this.onUpdateNode.bind(this)}
                    onSelectEdge={this.onSelectEdge.bind(this)}
                    onCreateEdge={this.onCreateEdge.bind(this)}
                    onSwapEdge={this.onSwapEdge.bind(this)}
                    onDeleteEdge={this.onDeleteEdge.bind(this)}
                    onDeleteNode={this.doNothing}
                />
            )
        }

    }


    render() {
        const selected = this.state.selected;

        console.log('render selected',selected)
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose.bind(this)}
            />
        ];

        return (

            <div>
                <Paper zDepth={2}>
                    <div style={{width: '100%', display: 'inline-block'}}>
                        <FlatButton
                            label="return"
                            onClick={() => this.toPreviousPage()}
                            style={{
                                margin: 14
                            }}/>
                        <FlatButton
                            label="continue"
                            onClick={() => this.toNextPage()}
                            style={{
                                float: 'right',
                                margin: 14
                            }}/>
                    </div>

                </Paper>
                <div style={{display:'flex'}}>
                    {this.renderGraph()}
                    <InfoBar style={
                        {
                            flex:0
                        }
                    }
                             selected={selected}
                             references={this.state.relations}
                    />



                </div>
                <Dialog
                    actions={actions}
                    modal={true}
                    open={this.state.dialog.open}
                >
                    <div style={{width:'100%'}}>
                        <TextField style={{width:'80%'}} floatingLabelText="Class name" onChange={this.onChange.bind(this)} />
                        <IconButton>
                            <ActionSearch onClick={this.searchVocabulary.bind(this)}/>
                        </IconButton>
                    </div>
                    <div style={{minHeight:'400px'}}>
                        <Table wrapperStyle={{paddingBottom:'27px'}}>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    <TableHeaderColumn tooltip="The vocabulary the relation originates from">Vocabulary</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="Link to the relation description">uri</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="The full prefix">Prefix</TableHeaderColumn>
                                    <TableHeaderColumn>Select</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                //[[C1,C2,C3,C4,C5,C6]
                                //[V1,V2,V3,V4,V5,V6]]
                                {this.renderDialogTableBody()}

                            </TableBody>

                        </Table>


                    </div>


                </Dialog>

            </div>
        )

    }


}
export default DataLinkView