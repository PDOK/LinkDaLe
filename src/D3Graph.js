/**
 * Created by Gerwin Bosch on 10-7-2017.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import './D3Graph.css'

const width = 960;
const height = 500;
let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.index }))
    .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(12) )
    .force("charge", d3.forceManyBody())
    .force("y", d3.forceY(0))
    .force("x", d3.forceX(0));
// *****************************************************
// ** d3 functions to manipulate attributes
// *****************************************************


function extract_size(object){
    return object.size;
}
function extract_label(object){
    return object.label;
}
function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}


let enterNode = (selection) => {
    selection.classed('circle', true);
    selection.append('circle')
        .attr("r", (d) => d.r)
        .attr("class", '.node')
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    selection.append('text')
        .attr("x", (d) => d.r + 5)
        .attr("dy", ".35em")
        .text((d) => d.label);
    selection.classed('square', true);
};
let enterSquare = (selection) => {
    selection.classed('square', true);
    selection.append('rect')
        .attr("width", (d) => d.r * 1.5)
        .attr("height", (d) => d.r * 1.5)
        .attr("class", '.node')

        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    selection.append('text')
        .attr("x", (d) => d.r + 5)
        .attr("dy", ".35em")
        .text((d) => d.label);


};

let updateNode = (selection) => {
    selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
};

let enterLink = (selection) => {
    selection.classed('link', true)
        .attr("stroke-width", (d) => d.size);
};

let updateLink = (selection) => {
    selection.attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
};

let updateGraph = (selection) => {
    selection.selectAll('.circle')
        .call(updateNode);
    selection.selectAll('.square')
        .call(updateNode);
    selection.selectAll('.link')
        .call(updateLink);
};

// *****************************************************
// ** Graph and App components
// *****************************************************

class Graph extends Component {
    constructor(props){
        super(props);
        console.log('props',props)
        this.state = {
            links:props.links,
            nodes:props.nodes
        }
        simulation.force("center", d3.forceCenter(props.width / 2, props.height / 2))

    }
    componentDidMount() {
        this.d3Graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));
        simulation.on('tick', () => {
            // after force calculation starts, call updateGraph
            // which uses d3 to manipulate the attributes,
            // and React doesn't have to go through lifecycle on each tick
            console.log('tick','tack')
            this.d3Graph.call(updateGraph);
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.d3Graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));
        const data = this.props.getData();
        console.log('d3Graph update',data)
        if(data.nodes) {
            var d3Nodes = this.d3Graph.selectAll('.circle')
                .data(data.nodes.filter((x) => x.type !== 'literal'), (node) => node.key);
            d3Nodes.enter().append('g').call(enterNode);
            d3Nodes.exit().remove();
            d3Nodes.call(updateNode);

            var d3Literals= this.d3Graph.selectAll('.square').filter((x) => x.type === 'literal')
                .data(data.nodes.filter((x) => x.type === 'literal'), (node) => node.key);
            d3Literals.enter().append('g').call(enterSquare);
            d3Literals.exit().remove();
            d3Literals.call(updateNode);

            if (data.links) {
                var d3Links = this.d3Graph.selectAll('.link')
                    .data(data.links, (link) => link.key);
                d3Links.enter().insert('line', '.node').call(enterLink);
                d3Links.exit().remove();
                d3Links.call(updateLink);
            }

            // we should actually clone the nodes and links
            // since we're not supposed to directly mutate
            // props passed in from parent, and d3's force function
            // mutates the nodes and links array directly
            // we're bypassing that here for sake of brevity in example
            simulation.nodes(data.nodes);
            if(data.links) {
                simulation.force("link").links(data.links);
                // simulation.force("linkDistance").links(nextProps.links)
            }
            this.d3Graph.call(updateGraph);
        }
        return true;
    }


    render() {

        return (
            <svg width={this.props.width} height={this.props.height}>
                <g ref='graph' />
            </svg>
        );
    }
}
export default Graph