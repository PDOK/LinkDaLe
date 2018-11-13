# Assignment 3: Call mister Postman

## Task

[SPARQL queries](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/) are sent via WEB using the HTTP protocol.
In short, a client sends an HTTP request to a SPARQL endpoint that handle the request and sends HTTP response back to the originating client.
In this way, you can send SELECT queries as well as UPDATE queries.
The latter allows managing data in a remote triple store. You can use both GET and POST requests.
Triple stores are able to response in mny formats and serialisations (e.g Turtle, RDF/XML, JSON and JSON-LD)

In this assignment you are asked to perform an HTTP request with a SPARQL query using an HTTP client.
You will use the last query (about product information) of the second assignment.
After you succeed in an HTTP client, you will send the same request from your Mendix application.

### Required knowledge

 1. The student knows how to query Linked Data using SPARQL
 2. The student knows the concept of federated querying
 3. The student knows how to send an HTTP request from Mendix software

### Goals

 1. To understand how SPARQL requests are constructed  
 2. To sand a SPARQL query from within Mendix app

### Assignment steps

* **Install [Postman](https://www.getpostman.com/apps)** for your platform. Postman is a user friendly HTTP client that is handy when it comes to development of HTTP requests.
* **Encode a query into a URL** using the URL-encoding [service](https://meyerweb.com/eric/tools/dencoder/). Use the last query from the previous assignment (about products).
* **Construct an HTTP request** by adding your encoded query to the base `http://virtuoso.almere.pilod.nl/sparql?query=`
* **Send the request** from Postman
* **Change query parameters** to have response in a desired format by changing the accept header e.g (to `accept:json` for JSON encoding)
* **Send the same request** from Mendix
