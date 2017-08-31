// This file contain methods to create queries

function getDefaultGraph() {
  return 'SELECT ?subject ?predicate ?object {?subject ?predicate ?object}';
}
function removeData(graphname) {
  return `DROP GRAPH <${graphname}>`;
}
function removeContextData(graphname) {
  return `DELETE WHERE { <${graphname}> ?s ?o}`;
}

export { getDefaultGraph, removeData, removeContextData };
