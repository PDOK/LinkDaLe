// This file contain methods to create queries

function getDefaultGraph() {
  return 'SELECT ?subject ?predicate ?object {?subject ?predicate ?object}';
}
export default { getDefaultGraph };
export { getDefaultGraph };
