/* eslint-disable react/jsx-no-bind,react/jsx-filename-extension */
/**
 * Created by Gerwin Bosch on 30-6-2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'material-ui/Tabs';
import DataImport from './DataImport';
import DataClassifyView from './DataClassifyView';
import DataLinkView from './DataLinkView';
import DownloadView from './DownloadView';
import { convertDataToTriples, nodeCreation } from './dataprocessing';
import literalMap from './literalMapping';

async function transformData(data, links, nodes) {
  return convertDataToTriples(data, links, nodes);
}


class DataCreation extends Component {
  static getFirstValues = (data) => {
    if (!data) {
      return undefined;
    }
    if (data.length !== 0) {
      const firstValues = new Array(data[0].length).fill('');
      data.some((column, idx) => {
        if (idx !== 0) {
          firstValues.forEach((value, index) => {
            if (column[index] && !value) {
              firstValues[index] = column[index];
            }
          });
        }
        return firstValues.filter(value => !value).length === 0;
      });
      return firstValues;
    }
    return [];
  };
  static identifyLiteral=(literal) => {
    if (Number(literal)) {
      if (literal % 1 === 0) return 'Integer';
      return 'float';
    }
    if (Date.parse(literal)) return 'Date-time';
    return 'String';
  };

  constructor() {
    super();
    this.state = {
      currentPage: 1,
      data: [],
      dataClassifications: [],
      classes: [],
      nodes: [],
      edges: [],
      processing: true,
      filename: '',
    };
  }


  // columnName: column,
  // exampleValue: temp[1][index],
  // class: {name:'Literal'},
  // uri: false,
  // label: false


  getExampleData(column, page) {
    let data = this.state.data.map((row, index) => {
      if (index === 0) {
        return undefined;
      }
      if (row[column]) {
        return row[column];
      }
      return undefined;
    });
    data = data.filter(n => n);
    let dataSubset;
    if (data.length / 10 < page) {
      dataSubset = data.slice(page * 10, data.length);
    } else {
      dataSubset = data.slice(page * 10, (page + 1) * 10);
    }
    return ({ results: dataSubset, max: data.length });
  }


  setData(data, filename) {
    let exampleValues;
    if (data.length > 1) {
      const firstValues = this.constructor.getFirstValues(data);
      exampleValues = data[0].map((column, index) =>
        ({
          columnName: column,
          exampleValue: firstValues[index],
          valueType: this.constructor.identifyLiteral(firstValues[index]),
          class: { name: 'Literal' },
          uri: false,
        }),
      );
    } else {
      exampleValues = [];
    }
    this.setState({
      data,
      dataClassifications: exampleValues,
      filename,
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
  setLiteralType = (index, value) => {
    const classes = this.state.dataClassifications.slice();
    const item = classes[index];
    if (value.label) {
      const definition = literalMap.find(def => def.label === value.label);
      definition.variableToAdd.forEach(
        (variableLabel) => { item[variableLabel] = value.value; },
      );
      item.valueType = value.label;
    } else {
      item.valueType = value;
    }
    classes[index] = item;
    this.setState({
      dataClassifications: classes,
    });
  };


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
          getExampleData={this.getExampleData.bind(this)}
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
          setLiteralType={this.setLiteralType}
        />
      );
    }
    return <div />;
  }

  render() {
    return (
      <Tabs value={this.state.currentPage}>
        <Tab label="Step 1: Upload data" value={1} disabled>
          {(this.state.currentPage === 1) ?
            <DataImport
              data={this.state.data}
              pageFunction={this.finishFirstStep.bind(this)}
              setData={this.setData.bind(this)}
            />
            : null}
        </Tab>
        <Tab label="Step 2: Classify data" value={2} disabled>
          {(this.state.currentPage === 2) ?
            this.renderDataClassifyView()
            : null}
        </Tab>
        <Tab label="Step 3: Link data" value={3} disabled>
          {(this.state.currentPage === 3) ?
            this.renderDataLink()
            : null}
        </Tab>
        <Tab label="Step 4: Download / Publish" value={4} disabled>
          {(this.state.currentPage === 4) ?
            <DownloadView
              processing={this.state.processing}
              graph={this.state.graph}
              executeQuery={this.props.executeQuery}
              filename={this.state.filename}
            />
            : null}
        </Tab>
      </Tabs>);
  }
}
DataCreation.propTypes = {
  executeQuery: PropTypes.func.isRequired,
};

export default DataCreation;
