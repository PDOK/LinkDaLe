# About Linked Open Data Cloud

An attempt to provide an overview of Linked Open Data occurrences is made by the publication of [the Linking Open Data Cloud diagram](http://lod-cloud.net/).
It portrays 1000+ datasets that are connected via Linked Open Data, although it does not mean that all datasets are open, license-wise.
The metadata of each dataset is accessible via <https://datahub.io> .

![Linking Open Data cloud diagram 2017, by Andrejs Abele, John P. McCrae, Paul Buitelaar, Anja Jentzsch and Richard Cyganiak. <http://lod-cloud.net/>](http://lod-cloud.net/versions/2017-08-22/lod.svg)

To be included in the diagram the dataset needs to meet the following criteria: it must contain at least 1000 triples,
it must connect to another dataset in the Cloud (the size of the circles corresponds to the number edges connected to each dataset),
 and must be accessible via an endpoint with resolvable web links (URIs). The LOD Cloud diagram provides a good entry point to a large number of datasets.
 The main prominent resources are DBpedia, a linked data extract of Wikipedia, and LinkedGeoData, an LD version of Openstreetmap.
 However, it does not necessarily enable the immediate meaningful connection between datasets. This needs a more careful evaluation of the semantics
 of the triples that are subject to such connection, possibly resulting in the semantic enrichment of them.