Browse Linked Data
======

### In short
In this tutorial you will learn how to browse the data created and published with the tool. 
n the previous exercise **My first Linked Data** a small piece of data was converted from SCV into LD. 


In **CSV** this looked like the following:

```
Name,Age,Place of birth
Neil,33,Enschede
Leelah,15,Utrecht
```

The resulting Linked Data representation of the same data is as follows:

``` xml
<http://rdf.paqt/Neil> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://rdf.paqt/Neil> <http://xmlns.com/foaf/0.1/name> "Neil"@en .
<http://rdf.paqt/Neil> <http://xmlns.com/foaf/0.1/age> "33"^^<https://www.w3.org/2001/XMLSchema#integer> .
<http://rdf.paqt/Neil> <http://www.w3.org/ns/person#placeOfBirth> "Enschede"@en .
<http://rdf.paqt/Leelah> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://rdf.paqt/Leelah> <http://xmlns.com/foaf/0.1/name> "Leelah"@en .
<http://rdf.paqt/Leelah> <http://xmlns.com/foaf/0.1/age> "15"^^<https://www.w3.org/2001/XMLSchema#integer> .
<http://rdf.paqt/Leelah> <http://www.w3.org/ns/person#placeOfBirth> "Utrecht"@en .
```

With the **Browse data** screen you can browse the data in a human-readable way using **Table** representation 
**Graph** and **Class Graph** views. You can lso delete published data from this screen.



### Views on Data

**Browse data** screen consist of 2 sections. First section, at the top of the screen, is a table featuring all the published datasets. 
The second section provides a **Table view**, **Graph view** and **Class Graph view** on the data in a dataset. 
Just select adataset of interest in the first section and see what is inside using different views

 #### Table View
 
Table view shows the data organised into 3 columns: Subject, Predicate and Object. 
Those columns represent three parts of a triple. Each raw can be read as a triple. 
A figure below shows an example of a Table view on the data created in the previous exercise.  

<img src="/images/browse_table.png" height="500" title="Table view on data"/> 
  
 #### Graph View

The Graph view visualises the data using a network visualisation. 
The URIs are shown as circles and literal values are represented as rectangles. 

<img src="/images/graph_view.png" height="300" title="Graph view on data"/> 


 #### Class Graph view
 
 Class Graph view shows a so called *data shape*, a structure of the classes, relation between them and their attributes. 
 
 <img src="/images/class_view.png" height="300" title="Class Graph view on data"/> 
 