// This file contain methods to create queries

function getDefaultGraph() {
  return 'SELECT ?subject ?predicate ?object WHERE { GRAPH <http://linkdale.org/metadata> {?subject ?predicate ?object}}';
}
function removeData(graphname) {
  return `CLEAR GRAPH <${graphname}>`;
}
function removeContextData(graphname) {
  return `DELETE WHERE { GRAPH <http://linkdale.org/metadata>{ <${graphname}> ?s ?o}}`;
}
function getAllDataFrom(graphname) {
  return `SELECT ?s ?p ?o { GRAPH <${graphname}> { ?s ?p ?o } }`;
}

export { getDefaultGraph, removeData, removeContextData, getAllDataFrom };
