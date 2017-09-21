My First Linked Data
======

## In short
In this tutorial you will learn how to create Linked Data representation of a simple table using ontologies.
The source for conversion is a table in a *.csv format. With the help of the tool this CSV-file will be converted into Linked Data. 

**Comma-separated values (CSV)** is a widespread format for spreadsheets and simple databases. 
It uses plain text to store tabular data. Each record consists of one or more fields (columns), 
separated by commas. This format is not standardized, but the idea to separate values using an agreed 
upon delimiter is very simple. There are many variants including tab-separated values and 
space-separated values. 

Therefore, first of all, we need a table. 

### Step 0: Let's make a table

Bellow is a simple **CSV** table that lists names of 2 persons together with their age and places of birth.   
In **CSV** this looks very simple:

```
Name,Age,Place of birth
Neil,33,Enschede
Leelah,15,Utrecht
```


And this is a rendered version:


<style>
table {
    border-collapse: collapse;
    width: 100%;
}

th, td {
    text-align: left;
    padding: 8px;
}

tr:nth-child(odd){background-color: #f2f2f2}

th {
    background-color: #4CAF50;
    color: white;
}
</style>


<table style="width:50%">
  <tr>
    <th>Name</th>
    <th>Age</th> 
    <th>Place of birth</th>
  </tr>
  <tr>
    <td>Neil</td>
    <td> 33 </td> 
    <td> Enschede </td> 
  </tr>
  <tr>
    <td>Leelah</td>
    <td>15</td>
    <td>Utrecht</td>
  </tr>
</table>

This data will be converted into Linked Data following the logic of the 4 design principles. 


### Step 1: Upload Data

Once the table is created it can be uploaded into the tool for transformation. 
This can be done on the first screen of the **"Create Link Data"** page. Just click **PICK A FILE** and submit a ***.CSV** file. The result will look like this:
 

<img src="/images/step1.png" height="300" title="Result of the firts step - upload data "/>


Click **Continue** to go to the next step.

### Step 2: Classify Data

A Figure bellow presents an initial view of the **CLASSIFY** screen. 
It is a table with 6 columns. The first column lists all the columns of the source data which example values can be seen in the second column. 
The third column asks if data presented in a column can be used for URIs. 

<img src="/images/classify1.png" height="300" title="Inititial view of the **CLASSIFY** screen"/>

#### Is it a URI?
The first 2 rules of link data stay:

* Use URIs as names for things
* Use HTTP URIs so that people can look up those names

What does it mean in practice? In short, this can be translated into 2 questions:
 1. What things should be named?
 2. What URI strategy should be used?
 
In the concept of the Semantic Web HTTP URIs are used as names for real-world objects and abstract concepts 
rather than as addresses for Web documents. 

For example, `http://dbpedia.org/resource/Berlin` is a URI identifier for Berlin in DBpedia. Any information related to Berlin will be linked to this URI. 

In the example data we have names of people their age and place of birth. In order to be able to look up information about a person meant in the data the person needs a URI.
Age and place of birth can be seen as 2 attributes of a person therefor they can be expressed as literals.


URI strategy refers to the way how URIs are formed. In general, a URI consists of a *base* - a part of URI that don't change and an addition that represents a unique data instance. 
In the example of Berlin `http://dbpedia.org/resource/` is the *base* of URI that defines a namespace. When `Berlin` is a one data instance of that namespace. 
For this assignment we will use `http://rdf.paqt/` a base for URIs

#### What is a class? 

The third rule of linked data stays:
3. When someone looks up a URI, provide useful information, using the standards 
([RDF](https://www.w3.org/RDF/) and [SPARQL](https://www.w3.org/TR/rdf-sparql-query/))

The RDF standard defines a data model (as subject-predicate-object triples) and a basic vocabulary that allows describing both Web documents and concepts from the real world—people, organisations, topics, things—in a computer-processable way.
In other words, things named with URIs can be described using this basic vocabulary. A basic description always include information that answers the questoin what it is.
For example, Berlin is a city. RDF provides a formal way to describe this. 

```
<http://dbpedia.org/resource/Berlin> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/City> .

This RDF statement (triple) literally says: "Berlin is a city"
```

The triple in the snippet above consists of three URIs - URI for Berlin, URI for relation (type) and URI representing a concept of a city. As mentioned above URIs can be used to describe abstract concepts (e.g city) apart from real-life objects (e.g real people). 
The collection of such concepts are called vocabularies or ontologies. 
People are encouraged to (re)use existing ontologies or to make their own. 

**Important:** 
>*URIs do not provide meaningful information by themselves. URI `http://dbpedia.org/resource/Berlin` 
does not say anything about what it is. Only information related to this URI describes the city.
Most useful information is about the type of a thing and its label*
  
  
In our example, it is known that the values in the column **Name** are unique therefore it is possible to form URIs using those values as additions.
Therefore, in order to indicate that column **Name** is used to make URIs, check a tick box "Is it a URI?" 

You will be prompt to fill a form to specify a base URI (http://rdf,paqt/). See figure bellow. 

<img src="/images/pick_uri.png" height="300" title="Pick a URI dialog"/>


After you click **Next** you will see another dialog that asks to provide a class. Type a name of a class (e.g person) into the search bar and click search. Select one term from the list of suggestions (e.g. foaf:Person). See the figure below.  

<img src="/images/select_class.png" height="300" title="Select a class name"/>


When you click **Finish** you will see an updated Classify screen with all the information you provided,  

<img src="/images/classify2.png" height="300" title="Result classify screen"/>

The **Reset** button will wipe out information you have provided for a column.
  
 ### Step 3: Link Data

When you click **Continue** you will be redirected to the screen where you can provide 
relations between data items you have identified in the previous steps. 
 
 <img src="/images/link_data.png" height="500" title="Initial Link Data screen"/>
 
The figure above shows an initial state of the **Link Data** screen. What you see is a graphical visualisation 
of the data items identified in the previous steps. **Circles** represent classes, **rectangles** - literal values. You can read about each of the objects from the right side bar.

One can notice an **arrow** pointing from the *Person* circle to the *Person* rectangle. This arrow is created by the software. It represents the `rdfs:label` relation. 
This is another basic relation that links a URI with its human-readable name. In general, it is a good practice 
to provide `rdf:type` and `rdfs:label`  for every URI. That is why we programmed the software to make labels automatically 
using the same data as for constructing URIs.

However, even though `rdfs:label` can be used for any class of objects, it is better to use terms from [Frend of a Frend (FOAF)](http://xmlns.com/foaf/spec/)
vocabulary when it comes to humans. This vocabulary was created for linking people and information using the Web. 

Therefore, change the relation by deleting an existing one (select a relation and press **Del** on the keyboard) and creating a new one by 
 by holding **Shift** and clicking on a node and dragging towards another node. When 2 items is connected you will see a dialog to submit a relation. 
 Type the relation name into a search bar and click search. Select a proper term from the suggested. 
   
**Important:**
>In RDF subject is always represented by a URI. Therefore, it is not possible to link 2 literal values.
 
If you have done everything right you will see a similar picture as below.

 <img src="/images/link_data2.png" height="500" title="Final Link Data screen"/>
 
Click **Continue** to get to the next step.

 ### Step 4: Download / Publish
 
Congratulations! You can see and read your newly created data from this screen. You can change serialisation (Turtle, JSON-LD, N-Triples) and download the data by clicking **Download**
button. 
 
**Publish** button will insert your data into a remote [triplestore](http://almere.pilod.nl:8890/sparql). This will make your data published on the Web Of Data! Just provide useful metadata by filling a form 
as it shown below.


<img src="/images/publish.png" height="500" title="Metadata dialog"/> 


CLick **Publish** and you are done!

You can browse your data from **Browse data** screen or query it from **Query data** screen. 
 








