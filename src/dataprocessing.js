import * as rdf from 'rdf-ext';
import literalMap from './literalMapping';

function createClassDefinitions(nodes, links) {
  const classDefinitions = [];
  nodes.forEach((node) => {
    // Skip when the nodes is a literal, as they can't have subjects
    if (node.type === 'Literal') return;
    // Get all the relations of this node
    let relations = links.map((link) => {
      if (link.source === node.id) {
        // Push relation and class
        return ({
          link,
          target:
              nodes.filter(nodeF => nodeF.id === link.target)[0],
        });
      }
      return undefined;
    });
    relations = relations.filter(relation => relation !== undefined);

    // When there are no relations skip the node
    if (relations.length === 0) return;
    classDefinitions.push({
      subject: node,
      relations,
    });
  });
  return classDefinitions;
}
// function classifyLiteral(literal) { //OLD GUESSING APPROACH
//   if (Number(literal)) {
//     if (literal % 1 === 0) return rdf.createLiteral(literal, null, 'http://www.w3.org/2001/XMLSchema#integer');
//     return rdf.createLiteral(literal, null, 'http://www.w3.org/2001/XMLSchema#float');
//   }
//   if (Date.parse(literal)) return rdf.createLiteral(Date.parse(literal).toISOString(), null, 'http://www.w3.org/2001/XMLSchema#date');
//   return rdf.createLiteral(literal, 'en', 'http://www.w3.org/2001/XMLSchema#string');
// }
function classifyLiteral(literal, target) {
  const literalDescription =
      literalMap.find(description => (description.label === target.valueType));
  if (literalDescription.variableToAdd.length > 0) {
    const extraVariable = literalDescription.variableToAdd[0];
    if (literalDescription.label === 'Language tagged String') {
      const value = target[extraVariable];
      return rdf.createLiteral(literal, value, literalDescription.uri);
    } else if (literalDescription.label === 'Other') {
      return rdf.createLiteral(literal, null, target[extraVariable]);
    }
  }
  return rdf.createLiteral(literal, null, literalDescription.uri);
}


function convertDataToTriples(data, links, nodes) {
  // Map relations
  const classDefinitions = createClassDefinitions(nodes, links);
  // For every node
  const graph = rdf.createGraph();
  // For every row of data except the header
  data.forEach((dataRow, dataIndex) => {
    if (dataIndex === 0) return;
    classDefinitions.forEach((classDefinition) => {
      if (!dataRow[classDefinition.subject.column]) return;
      // Skip when there are no relations
      if (classDefinition.relations.length === 0) return;
      // If there is no item create a new one
      const dataSubject = rdf.createNamedNode(dataRow[classDefinition.subject.column]);
      const typeOf = rdf.createNamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
      if (graph.filter(relation => relation.object === dataSubject
              && relation.predicate === typeOf).length === 0) {
        graph.add(rdf.createTriple(
          dataSubject,
          typeOf,
          rdf.createNamedNode(classDefinition.subject.uri)));
      }
      // For every relation check if there is a value
      classDefinition.relations.forEach((relation) => {
        const relationNode = rdf.createNamedNode(relation.link.link);
        if (dataRow[relation.target.column]) {
          // The target value
          let targetValue = dataRow[relation.target.column];
          // If the relation is not mentioned yet
          if (relation.target.type === 'literal') {
            targetValue = classifyLiteral(targetValue, relation.target);
          } else {
            targetValue = rdf.createNamedNode(targetValue);
          }
          // eslint-disable-next-line no-underscore-dangle
          if (graph._graph.filter(node => (node.object === dataSubject
                  && node.predicate === relationNode
                  && node.subject === targetValue)).length === 0) {
            graph.add(rdf.createTriple(dataSubject, relationNode, targetValue));
          }
        }
      });
    });
  });
  return graph;
}

function distribute(data) {
  let dX = 100;
  let dY = 100;
  const rowLength = Math.ceil(Math.sqrt(data.length));
  return data.map((dataItem, index) => {
    if (index % rowLength === 0 && index !== 0) {
      dX = 100;
      dY += 225;
    }
    const dataCopy = dataItem;
    if (!dataCopy.x) {
      dataCopy.x = dX;
      dataCopy.y = dY;
      dX += 225;
    }
    return dataCopy;
  });
}

function nodeCreation(data, classifications) {
  let nodes = [];
  const edges = [];
  classifications.forEach((classification, index) => {
    if (classification.baseUri) {
      nodes.push(
        {
          id: (nodes.length),
          label: data[0][index],
          type: 'literal',
          r: 30,
          title: data[0][index],
          column: index,
          valueType: 'String',
        });
      nodes.push(
        {
          id: (nodes.length),
          label: `${classification.class.name}`,
          type: 'uri',
          r: 30,
          title: `${classification.class.prefix}`,
          uri: classification.class.uri,
          prefixedName: classification.class.vocabPrefix,
          column: data[0].length,
        });
      edges.push(
        {
          source: nodes.length - 1,
          target: nodes.length - 2,
          relation: 'rdfs:label',
          r: 30,
          type: 'emptyEdge',
          title: 'label',
          link: 'https://www.w3.org/2000/01/rdf-schema#label',
          vocabPrefix: 'rdfs',
          prefix: 'rdfs:label',
        },
      );
      let newRow = data.map((dataRow, rowIndex) => {
        // Column header
        if (rowIndex === 0) {
          return `${classification.class.name}`;
        }
        // Data is empty
        if (!dataRow[index]) {
          return '';
        }
        // Find the same
        const like = data.filter(rowData => rowData[index] === dataRow[index]);
        if (like.length > 0) {
          return like[0][index];
        }
        return '';
      });
      if (classification.baseUri) {
        newRow = newRow.map((item, idx) => {
          if (!item) {
            return '';
          }
          let baseUri = classification.baseUri;
          if (idx === 0) {
            return item;
          }
          if (baseUri.startsWith('www')) {
            baseUri = `http://${baseUri}`;
          } else if (!baseUri.startsWith('http')) {
            baseUri = `http://www.${baseUri}`;
          }
          if (classification.baseUri[classification.baseUri.length - 1] !== '/') {
            baseUri += '/';
          }
          return baseUri + encodeURI(item.replace(/ /g, '_'));
        });
      }
      data.forEach((dataRow, idx) => dataRow.push(newRow[idx]));
    } else if (classification.class.uri) {
      nodes.push(
        {
          id: (nodes.length),
          label: classification.class.name,
          type: 'uri',
          r: 30,
          title: classification.class.name,
          uri: classification.class.uri,
          column: index,
        });
    } else {
      const definition = literalMap.find(def => def.label === classification.valueType);
      const node = {
        id: (nodes.length),
        label: classification.columnName,
        type: 'literal',
        r: 30,
        title: classification.columnName,
        column: index,
        valueType: classification.valueType,
      };
      if (definition.variableToAdd.length > 0) {
        node[definition.variableToAdd[0]] = classification[definition.variableToAdd[0]];
      }
      nodes.push(node);
    }
  });

  // Distribution algorithm
  nodes = distribute(nodes);
  return ({
    data,
    edges,
    nodes,
  });
}
export { convertDataToTriples, createClassDefinitions, nodeCreation, distribute };
