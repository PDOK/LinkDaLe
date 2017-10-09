/* eslint-disable react/jsx-filename-extension */
// import 'jsdom-global/register'; // Uncomment when testing locally
import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  shallow(<App />);
});


// it('datastore did mount', () => {
//   const wrapper = mount(<App />);
//   expect(wrapper.state().store).toBeDefined();
// });
//
// it('load data in named graph', (done) => {
//   const wrapper = mount(<App />);
//   const query = 'INSERT DATA { GRAPH <dataset-uris> {\n' +
//       '<http://gerwinbosch.nl> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
//       '<http://gerwinbosch.nl> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
//       '<http://gerwinbosch.nl> <http://xmlns.com/foaf/0.1/age> "23"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
//       '<http://gerwinbosch.nl> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q992"@en .\n' +
//       '<http://gerwinbosch.nl> <http://xmlns.com/foaf/0.1/lastName> "Bosch"@en .\n' +
//       '<http://gerwinbosch.nl> <http://xmlns.com/foaf/0.1/firstName> "Gerwin"@en .\n' +
//       '<http://gerwinbosch.nl/Company> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://vivoweb.org/ontology/core#Company> .\n' +
//       '<http://gerwinbosch.nl/Company> <http://www.w3.org/2000/01/rdf-schema#label> "Bosch Programming"@en .\n' +
//       '<http://gerwinbosch.nl/Company> <http://www.w3.org/2000/01/rdf-schema#seealso> "asd Programming"@en .\n' +
//       '<http://www.toosenhenk.nl/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
//       '<http://www.toosenhenk.nl/> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
//       '<http://www.toosenhenk.nl/> <http://xmlns.com/foaf/0.1/age> "43"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
//       '<http://www.toosenhenk.nl/> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q10001"@en .\n' +
//       '<http://www.toosenhenk.nl/> <http://xmlns.com/foaf/0.1/lastName> "Henk"@en .\n' +
//       '<http://www.toosenhenk.nl/> <http://xmlns.com/foaf/0.1/firstName> "Toos"@en .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://xmlns.com/foaf/0.1/age> "25"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q10020"@en .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://xmlns.com/foaf/0.1/lastName> "Yvon"@en .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://xmlns.com/foaf/0.1/firstName> "Jasper"@en .\n' +
//       '<http://dirkjan.nl/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
//       '<http://dirkjan.nl/> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
//       '<http://dirkjan.nl/> <http://xmlns.com/foaf/0.1/age> "39"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
//       '<http://dirkjan.nl/> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q803"@en .\n' +
//       '<http://dirkjan.nl/> <http://xmlns.com/foaf/0.1/lastName> "Jan"@en .\n' +
//       '<http://dirkjan.nl/> <http://xmlns.com/foaf/0.1/firstName> "Dirk"@en .\n' +
//       '}}';
//   wrapper.instance().executeSparql(query, () => {
//     // Wait until the dataset it is loaded
//     const queryAll = '' +
//         'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
//         'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' +
//         'PREFIX : <http://example.org/>\n' +
//         'SELECT ?s { GRAPH <dataset-uris> { ?s ?p ?o } }' +
//         ' LIMIT 100';
//     wrapper.instance().executeSparql(queryAll, (error, result) => {
//       expect(result.length).toBe(27);
//       done();
//     });
//   });
// });
// it('contextstore test', (done) => {
//   const contextQuery = 'INSERT DATA {' +
//   '<http://rdf.paqt/DATASET1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://rdfs.org/ns/void#Datset> .\n' +
//       '<http://rdf.paqt/DATASET1> <http://purl.org/dc/terms/title> "Dataset1" .\n' +
//       '<http://rdf.paqt/DATASET1> <http://purl.org/dc/terms/description> "data for BPIL" .\n' +
//       '<http://rdf.paqt/DATASET1> <http://purl.org/dc/terms/created> "2017-11-17"^^<http://www.w3.org/2001/XMLSchema#date> .\n}';
//   const wrapper = mount(<App />);
//   wrapper.instance().executeSparql(contextQuery, () => {
//     // Wait until the dataset it is loaded
//     const queryAll = '' +
//         'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
//         'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' +
//         'PREFIX : <http://example.org/>\n' +
//         'SELECT ?s ?p ?o  { ?s ?p ?o }' +
//         ' LIMIT 100';
//     wrapper.instance().executeSparql(queryAll, (error, result) => {
//       expect(result.length).toBe(4);
//       done();
//     });
//   });
// });
//
// it('Remove test', (done) => {
//   const contextQuery = 'INSERT DATA {' +
//       '<http://rdf.paqt/DATASET1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://rdfs.org/ns/void#Datset> .\n' +
//       '<http://rdf.paqt/DATASET1> <http://purl.org/dc/terms/title> "Dataset1" .\n' +
//       '<http://rdf.paqt/DATASET1> <http://purl.org/dc/terms/description> "data for BPIL" .\n' +
//       '<http://rdf.paqt/DATASET1> <http://purl.org/dc/terms/created> "2017-11-17"^^<http://www.w3.org/2001/XMLSchema#date> .\n}';
//   const wrapper = mount(<App />);
//   wrapper.instance().executeSparql(contextQuery, () => {
//     // Wait until the dataset it is loaded
//     const queryAll = '' +
//         'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
//         'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' +
//         'PREFIX : <http://example.org/>\n' +
//         'SELECT ?s ?p ?o  { ?s ?p ?o }' +
//         ' LIMIT 100';
//     wrapper.instance().executeSparql(queryAll, (error, result) => {
//       expect(result.length).toBe(4);
//       wrapper.instance().executeSparql(removeContextData('http://rdf.paqt/DATASET1'), () => {
//         wrapper.instance().executeSparql(queryAll, (_, resultz) => {
//           expect(resultz.length).toBe(0);
//           done();
//         });
//       });
//     });
//   });
// });
//
// it('Remove named graph', (done) => {
//   const wrapper = mount(<App />);
//   const query = 'INSERT DATA { GRAPH <dataset-uris> {\n' +
//       '<http://gerwinbosch.nl> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
//       '<http://gerwinbosch.nl> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
//       '<http://gerwinbosch.nl> <http://xmlns.com/foaf/0.1/age> "23"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
//       '<http://gerwinbosch.nl> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q992"@en .\n' +
//       '<http://gerwinbosch.nl> <http://xmlns.com/foaf/0.1/lastName> "Bosch"@en .\n' +
//       '<http://gerwinbosch.nl> <http://xmlns.com/foaf/0.1/firstName> "Gerwin"@en .\n' +
//       '<http://gerwinbosch.nl/Company> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://vivoweb.org/ontology/core#Company> .\n' +
//       '<http://gerwinbosch.nl/Company> <http://www.w3.org/2000/01/rdf-schema#label> "Bosch Programming"@en .\n' +
//       '<http://gerwinbosch.nl/Company> <http://www.w3.org/2000/01/rdf-schema#seealso> "asd Programming"@en .\n' +
//       '<http://www.toosenhenk.nl/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
//       '<http://www.toosenhenk.nl/> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
//       '<http://www.toosenhenk.nl/> <http://xmlns.com/foaf/0.1/age> "43"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
//       '<http://www.toosenhenk.nl/> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q10001"@en .\n' +
//       '<http://www.toosenhenk.nl/> <http://xmlns.com/foaf/0.1/lastName> "Henk"@en .\n' +
//       '<http://www.toosenhenk.nl/> <http://xmlns.com/foaf/0.1/firstName> "Toos"@en .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://xmlns.com/foaf/0.1/age> "25"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q10020"@en .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://xmlns.com/foaf/0.1/lastName> "Yvon"@en .\n' +
//       '<http://datingforgeeks.tumblr.com/> <http://xmlns.com/foaf/0.1/firstName> "Jasper"@en .\n' +
//       '<http://dirkjan.nl/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
//       '<http://dirkjan.nl/> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
//       '<http://dirkjan.nl/> <http://xmlns.com/foaf/0.1/age> "39"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
//       '<http://dirkjan.nl/> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q803"@en .\n' +
//       '<http://dirkjan.nl/> <http://xmlns.com/foaf/0.1/lastName> "Jan"@en .\n' +
//       '<http://dirkjan.nl/> <http://xmlns.com/foaf/0.1/firstName> "Dirk"@en .\n' +
//       '}}';
//   wrapper.instance().executeSparql(query, () => {
//     // Wait until the dataset it is loaded
//     const queryAll = '' +
//         'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
//         'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' +
//         'PREFIX : <http://example.org/>\n' +
//         'SELECT ?s { GRAPH <dataset-uris> { ?s ?p ?o } }' +
//         ' LIMIT 100';
//     wrapper.instance().executeSparql(queryAll, (error, result) => {
//       expect(result.length).toBe(27);
//       wrapper.instance().executeSparql(removeData('dataset-uris'), () => {
//         wrapper.instance().executeSparql(queryAll, (_, results) => {
//           expect(results.length).toBe(0);
//           done();
//         });
//       });
//     });
//   });
// });
//
