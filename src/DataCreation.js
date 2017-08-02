/* eslint-disable react/jsx-no-bind,react/jsx-filename-extension */
/**
 * Created by Gerwin Bosch on 30-6-2017.
 */
import React, { Component } from 'react';
import { Tab, Tabs } from 'material-ui/Tabs';
import DataImport from './DataImport';
import DataClassifyView from './DataClassifyView';
import DataLinkView from './DataLinkView';
import DownloadView from './DownloadView';
import { convertDataToTriples, nodeCreation } from './Dataprocessing';

async function transformData(data, links, nodes) {
  return convertDataToTriples(data, links, nodes);
}


class DataCreation extends Component {
  constructor() {
    super();
    if (this.state) {
      if (this.state.data) {
        console.error('DATA ALREADY EXISTS');
      }
    }
    this.state = {
      currentPage: 1,
      data: [],
      dataClassifications: [],
      classes: [],
      nodes: [],
      edges: [],
      processing: true,
    };
  }


    // columnName: column,
    // exampleValue: temp[1][index],
    // class: {name:'Literal'},
    // uri: false,
    // label: false


  getData() {
    return ({ nodes: this.state.nodes, links: this.state.edges });
  }


  setData(data) {
    let exampleValues;
    if (data.length > 1) {
      exampleValues = data[0].map((column, index) => ({
        columnName: column,
        exampleValue: data[1][index],
        class: { name: 'Literal' },
        uri: false,
      }));
    } else {
      exampleValues = {};
    }
    this.setState({
      data,
      dataClassifications: exampleValues,
    });
  }

  setUri(index, boolean) {
    const dataClasses = this.state.dataClassifications.slice();
    const item = dataClasses[index];
    item.uri = boolean;
    dataClasses[index] = item;
    this.setState({
      dataClassifications: dataClasses,
    });
  }

  setClass(index, classification) {
    const dataClasses = this.state.dataClassifications.slice();
    const item = dataClasses[index];
    item.class = classification;
    dataClasses[index] = item;
    this.setState({
      dataClassifications: dataClasses,
    });
  }

  setBaseUri(index, classification) {
    const classes = this.state.dataClassifications.slice();
    const item = classes[index];
    item.baseUri = classification;
    classes[index] = item;
    this.setState({
      dataClassifications: classes,
    });
  }

  setActiveNode(index, node) {
    const nodes = this.state.nodes.slice();
    nodes[index] = node;
    this.setState({
      nodes,
    });
  }

  toThirdStep() {
    // Convert data to nodes and edges
    this.setState(
      {
        nodes: [],
        edges: [],
      },
    );
    const result = nodeCreation(this.state.data.slice(), this.state.dataClassifications.slice());
    const nodes = result.nodes;
    const edges = result.edges;
    const data = result.data;
    this.setState({
      data,
      currentPage: 3,
      classes: this.state.dataClassifications,
      nodes,
      edges,
    });
  }
  goBackTo(index) {
    switch (index) {
      case 2:
        this.setState({
          nodes: [],
          edges: [],
          currentPage: 2,
        });
        break;
      default:
        this.setState({
          currentPage: index,
        });

    }
  }

  goToFinalPage() {
    this.setState({
      currentPage: 4,
    });
    transformData(this.state.data, this.state.edges, this.state.nodes)
    .then((result) => {
      this.setState({
        graph: result,
        processing: false,
      });
    });
  }
  finishFirstStep() {
    this.setState({
      currentPage: 2,
    });
  }


  pushEdge(newEdge) {
    const links = this.state.edges.slice();
    links.push(newEdge);
    this.setState({
      edges: links,
    },
        );
  }

  deleteEdge(index) {
    const edges = this.state.edges;
    edges.splice(index, 1);
    this.setState({ links: edges });
  }

  renderDataLink() {
    if (this.state.nodes) {
      return (
        <DataLinkView
          nodes={this.state.nodes}
          links={this.state.edges}
          getData={this.getData.bind(this)}
          nextPage={this.goToFinalPage.bind(this)}
          previousPage={this.goBackTo.bind(this)}
          setNode={this.setActiveNode.bind(this)}
          pushEdge={this.pushEdge.bind(this)}
          deleteEdge={this.deleteEdge.bind(this)}
        />
      );
    }
    return <div />;
  }
  renderDataClassifyView() {
    if (this.state.data) {
      return (
        <DataClassifyView
          data={this.state.dataClassifications}
          nextPage={this.toThirdStep.bind(this)}
          setClass={this.setClass.bind(this)}
          setUri={this.setUri.bind(this)}
          setBaseUri={this.setBaseUri.bind(this)}
        />
      );
    }
    return <div />;
  }

  render() {
    return (
      <Tabs value={this.state.currentPage}>
        <Tab label="Step 1: Create Data" value={1} disabled>
          <DataImport
            data={this.state.data}
            pageFunction={this.finishFirstStep.bind(this)}
            setData={this.setData.bind(this)}
          />
        </Tab>
        <Tab label="Step 2: Classify Data" value={2} disabled>
          {this.renderDataClassifyView()}
        </Tab>
        <Tab label="Step 3: Link Data" value={3} disabled>
          {this.renderDataLink()}
        </Tab>
        <Tab label="Step 4: Finished" value={4} disabled>
          <DownloadView processing={this.state.processing} graph={this.state.graph} />
        </Tab>

      </Tabs>);
  }


}

export default DataCreation;
