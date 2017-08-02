import { createClassDefinitions, nodeCreation } from './Dataprocessing';


it('create relation definitions', () => {
  const links = [
    {
      source: 0,
      target: 1,
      relation: 'rdfs:label',
      r: 30,
      type: 'emptyEdge',
      title: 'label',
      link: 'https://www.w3.org/2000/01/rdf-schema#label',
    },
  ];
  const nodes = [
    {
      id: 0,
      label: 'Testnode1',
      type: 'uri',
      r: 30,
      title: 'TestClass1',
      uri: 'http://test.nl',
      column: 0,
    },
    {
      id: 1,
      label: 'Testnode2',
      type: 'Literal',
      r: 30,
      title: 'TestClass2',
      uri: 'http://test.nl',
      column: 0,
    },
  ];
  const classDefinitions = createClassDefinitions(nodes, links);
  expect(classDefinitions[0].subject).toBe(nodes[0]);
  expect(classDefinitions[0].relations[0].target).toBe(nodes[1]);
});

it('No definitions', () => {
  const links = [
    {
      source: 0,
      target: 1,
      relation: 'rdfs:label',
      r: 30,
      type: 'emptyEdge',
      title: 'label',
      link: 'https://www.w3.org/2000/01/rdf-schema#label',
    },
  ];
  const nodes = [
    {
      id: 0,
      label: 'Testnode1',
      type: 'Literal',
      r: 30,
      title: 'TestClass1',
      uri: 'http://test.nl',
      column: 0,
    },
    {
      id: 1,
      label: 'Testnode2',
      type: 'Literal',
      r: 30,
      title: 'TestClass2',
      uri: 'http://test.nl',
      column: 0,
    },
  ];
  const classDefinitions = createClassDefinitions(nodes, links);
  expect(classDefinitions.length).toBe(0);
});

it('Mutliple Relations', () => {
  const links = [
    {
      source: 0,
      target: 1,
      relation: 'rdfs:label',
      r: 30,
      type: 'emptyEdge',
      title: 'label',
      link: 'https://www.w3.org/2000/01/rdf-schema#label',
    },
    {
      source: 0,
      target: 1,
      relation: 'rdfs:label',
      r: 30,
      type: 'emptyEdge',
      title: 'label',
      link: 'https://www.w3.org/2000/01/rdf-schema#label',
    },
  ];
  const nodes = [
    {
      id: 0,
      label: 'Testnode1',
      type: 'uri',
      r: 30,
      title: 'TestClass1',
      uri: 'http://test.nl',
      column: 0,
    },
    {
      id: 1,
      label: 'Testnode2',
      type: 'Literal',
      r: 30,
      title: 'TestClass2',
      uri: 'http://test.nl',
      column: 0,
    },
  ];
  const classDefinitions = createClassDefinitions(nodes, links);
  expect(classDefinitions[0].relations.length).toBe(2);
});
it('Nodes length', () => {
  const data = [['Column1', 'Column2', 'Column3', 'Column4'],
    ['Value11', 'Value12', 'Value13', 1.52],
    ['Value11', 'Value22', 'Value23', 1.52],
    ['Value21', 'Value22', 'Value23', 1.52],
    ['Value31', 'Value32', 'Value33', 1.52],
    ['Value41', 'Value42', 'Value43', 1.52]];
  const classifications = [{
    columnName: 'Column1',
    class: {
      name: 'Column1',
      uri: 'uri1',
    },
    baseUri: '',
  },
  {
    columnName: 'Column2',
    class: {
      name: 'Column2',
      uri: 'uri2',
    },
  },
  {
    columnName: 'Column3',
    class: {
      name: 'Literal',
    },
    baseUri: '',
  },
  {
    columnName: 'Column4',
    class: {
      name: 'Literal',
    },
    baseUri: '',
  },
  ];
  const result = nodeCreation(data, classifications);
  expect(result.nodes.length).toBe(4);
  expect(result.edges.length).toBe(0);
  expect(result.data[0].length).toBe(4);
});

it('Uri node generation', () => {
  const data = [['Column1', 'Column2', 'Column3', 'Column4'],
    ['Value11', 'Value12', 'Value13', 1.52],
    ['Value11', 'Value22', 'Value23', 1.52],
    ['Value21', 'Value22', 'Value23', 1.52],
    ['Value31', 'Value32', 'Value33', 1.52],
    ['Value41', 'Value42', 'Value43', 1.52]];
  const classifications = [{
    columnName: 'Column1',
    class: {
      name: 'Column1',
      uri: 'uri1',
    },
    baseUri: 'kaas',
  },
  {
    columnName: 'Column2',
    class: {
      name: 'Column2',
      uri: 'uri2',
    },
    baseUri: '',
  },
  {
    columnName: 'Column3',
    class: {
      name: 'Literal',
    },
    baseUri: '',
  },
  {
    columnName: 'Column4',
    class: {
      name: 'Literal',
    },
    baseUri: '',
  },
  ];
  const result = nodeCreation(data, classifications);
  expect(result.nodes.length).toBe(5);
  expect(result.edges.length).toBe(1);
  expect(result.data[0].length).toBe(5);
});
