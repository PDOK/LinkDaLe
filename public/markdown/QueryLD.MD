# Query Linked Data

---------------

## In short

In this tutorial you will learn how to query Linked Data you have created and published.
[SPARQL](https://www.PAw3.org/TR/sparql11-query/) is the query language for the Semantic Web and Linked Data.
SPARQL is very expressive and capable of federated querying. The former allows constructing complex queries when
the latter gives possibility to query more than one repository on runtime.

As a consequence, it is dead easy to make a query that crashes any repository. Therefore, make sure that your queries don't multiply everything by everything.

## Use LIMIT

However, even though most of the repositories set limitations on query runtime and the number
of output triples to protect the service, it is a good practice to use ***LIMIT*** keyword in your queries to limit number of triples that triple store returns.
Using ***LIMIT*** will increase your performance of query development because you
will not waste time waiting while a triplestore sends back millions of triples that you don't
need for development.

For example, the default query with a limit set to 100 will retrieve only first 100 solutions:

```SPARQL
SELECT ?s ?p ?o
{?s ?p ?o}
Limit 100

```

### Query interface

LinkDaLe provides a SPARQL query interface. It has quite typical appearance for such interfaces.
Other prominent examples are [YasGUI](http://yasgui.org/) and [isparql](https://www.openlinksw.com/isparql/)
From the figure below you can see that the interface consists of 3 main fields and the run button.

![Query interface of LinkDaLe](/images/query_interface.png)

By default the query interface is aimed at the SPARQL endpoint of <http://virtuoso.almere.pilod.nl:8890/sparql> .
The initial query in the Query form retrieves everything from that endpoint.
This the query:

```SPARQL
SELECT ?s ?p ?o
{?s ?p ?o}

```

If you click the run button you will have **all the triples** available in a triple store.

The dataset selector focuses the query only on one dataset.
In the world of Linked Data datasets are represented as named graphs,
therefore selecting a dataset will add the **GRAPH** keyword that allows to specify which graph to query within a triple store.
For example, the following query will retrieve all the triples from the graph with URI
<http://linkdale.org/data/test> :

```SPARQL
SELECT ?subject ?predicate ?object
WHERE {
  GRAPH <http://linkdale.org/data/test> {
    ?subject ?predicate ?object}
}
```

### Some query examples

It is advised to read [SPARQL documentation](https://www.w3.org/TR/sparql11-query/) to get good understanding of the query language.
Here we give very basic explanation and examples.

> Most forms of SPARQL query contain a set of triple patterns called a basic graph pattern.
Triple patterns are like RDF triples except that each of the subject, predicate and object
may be a variable.

In the default query a basic graph pattern is expressed as three variables  `?s ?p ?o` .

```SPARQL
SELECT ?s ?p ?o
{
  ?s ?p ?o
}
```

The first variable `?s` represents subject of a triple, `?p` is for a predicate and `?o` for a object.
Such a triple pattern is valid for every triple in a triple store, therefore the result of the
query will be all the triples.

Each of the variales in a triple pattern can be substitute with an RDF term.

#### First 10 of a class

For example, lets find 10 persons in the triple store.
The assumption is that they are classified using `foaf:Person`.
For this we just need to make a triple pattern where subject is unknown (a variable),
a predicate is <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>  and an object is the class `foaf:Person`

>The keyword "a" can be used as a predicate in a triple pattern and is an alternative for the IRI  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>. This keyword is case-sensitive.

Therefore the query will be:

```SPARQL
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?s ?p ?o
{
  ?s a foaf:Person
}
Limit 10
```

In the query, a namespace prefix binding (foaf) is used to shorten the declaration of the pattern.
However, you can use full URI in a triple pattern.

For example, this is the same query that retrieves 10 persons without the keyword **a** and prefixes:

```SPARQL
SELECT ?s ?p ?o
{
  ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>  <http://xmlns.com/foaf/0.1/Person>
}
Limit 10
```

#### Their names

Lets ask about the names of those people we found before. We need to ad 1 additional triple pattern that retrieves the names of people using foaf:name:

```SPARQL
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?s ?name
{
  ?s a foaf:Person.
    ?s foaf:name ?name.
}
Limit 10
```

In the query, we specified a class of a variable (`?s a foaf:Person`) and we added additional triple pattern
that asks for objects (`?name`) that are connected to ?s using foaf:name predicate (`?s foaf:name ?name`).

### Federation

The [SPARQL specification](https://www.w3.org/TR/2013/REC-sparql11-federated-query-20130321/) states:

>RDF is a directed, labeled graph data format for representing information in the Web.
>SPARQL can be used to express queries across diverse data sources, whether the data is stored
natively as RDF or viewed as RDF via middleware.
SPARQL allows executing queries distributed over different SPARQL endpoints.
The SERVICE keyword is used to support queries that merge data distributed across the Web.

To put it short, federation makes it possible to query more than one endpoint at a time.
Example below retrieves first 10 triples from DBpedia:

```SPARQL
SELECT ?s ?p ?o
  {
    Service <http://dbpedia.org/sparql>
      {?s ?p ?o}
  }
Limit 10
```

As it was stated above LinkDaLe works with the endpoint <http://viruoso.almere.pilod.nl/sparql>
Therefore, all the queries is executed by that endpoint. The query above was sent
 to <http://virtuso.almere.pilod.nl/sparql> . The endpoint precessed the query (found ***SERVICE*** keyword) and
 sent another query to DBpedia endpoint specified after the ***SERVICE*** keyword. The DBpedia endpoint processed the request returned it to <http://virtuoso.almere.pilod.nl:8890/sparql> and then, it was back in the browser.
