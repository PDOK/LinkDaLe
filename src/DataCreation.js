/**
 * Created by Gerwin Bosch on 30-6-2017.
 */
import React, {Component} from 'react';
import {Tab, Tabs} from 'material-ui/Tabs';
import DataImport from './DataImport'
import DataClassifyView from './DataClassifyView'
import DataLinkView from './DataLinkView'
import DownloadView from './DownloadView'
import * as rdf from 'rdf-ext';
import * as JSONLD_Serializer from 'rdf-serializer-n3';



const States = {
    DataUpload: 11,
    DataClassifying: 12,
    DataLinking: 13,
    DataPublishing: 14,
};
async function transformData(data, classes, links, nodes){
    return await convertDataToTriples(data, classes, links, nodes)
}
function convertDataToTriples(data, classes, links, nodes){
    // Map relations
    let classDefinitions=[];
    //For every node
    for(let i = 0; i < nodes.length ; i++){
        let subject = nodes[i];
        //Skip when the nodes is a literal, as they can't have subjects
        if(subject.type==='Literal') continue;
        let relations = [];
        //Get all the relations of this node
        for( let j = 0; j < links.length; j++){
            let relation = links[j];
            if(relation.source === subject.id){
                //Push relation and class
                relations.push({relation:relation,target:getItemById(nodes,relation.target)})
            }
        }
        //When there are no relations skip the node
        if(relations.length===0) continue;
        classDefinitions.push({
            subject:subject,
            relations:relations
        })
    }
    let graph = rdf.createGraph();
    let results = [];
    //For every row of data except the header
    for(let k = 1; k <data.length; k++){
        let dataRow = data[k];
        //Check if the uri is in that label
        for(let id = 0; id < classDefinitions.length; id++){
            let cd = classDefinitions[id];
            //Skip when the value is not present in the data
            console.log(cd);
            if(!dataRow[cd.subject.column]) continue;
            //Skip when there are no relations
            if(cd.relations.length===0) continue;
            //If there is no item create a new one
            let skip = false;
            let dataSubject = rdf.createNamedNode(dataRow[cd.subject.column]);
            let typeOf = rdf.createNamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
            for(let i = 0; i < graph.length ; i++){
                let node = graph._graph[i];
                if(node.object===dataSubject && node.predicate===typeOf){
                    skip = true;
                    break;
                }
            }
            console.log(dataRow[cd.subject.column]);
            if(!skip){
                graph.add(rdf.createTriple(dataSubject,typeOf,rdf.createNamedNode(cd.subject.uri)))
            }
            //For every relation check if there is a value
            for(let relCounter=0; relCounter<cd.relations.length; relCounter++){
                let relation = cd.relations[relCounter];
                //If there is a relation
                let relationNode = rdf.createNamedNode(relation.relation.link);
                console.log(relation);
                if(dataRow[relation.target.column]) {
                    //The target value
                    let targetValue = dataRow[relation.target.column];
                    //If the relation is not mentioned yet
                    if(relation.target.type === 'literal'){
                        if(!Number(targetValue)){//String literal
                            targetValue = rdf.createLiteral(targetValue,'en','http://www.w3.org/2001/XMLSchema#string')
                        } else if (targetValue % 1 ===0){// Integer Literal
                            targetValue = rdf.createLiteral(targetValue,null,'https://www.w3.org/2001/XMLSchema#integer')
                        } else {// Float Literal
                            targetValue = rdf.createLiteral(targetValue,null,'https://www.w3.org/2001/XMLSchema#float')
                        }
                    } else {
                        targetValue = rdf.createNamedNode(targetValue)
                    }
                    console.log(graph._graph);
                    for (let gi = 0 ; gi < graph.length ; gi ++){
                        let occ = graph._graph[gi];
                        if(occ.object!== dataSubject && occ.predicate !== relationNode && occ.subject !== targetValue){
                            graph.add(rdf.createTriple(dataSubject,relationNode,targetValue));
                        }
                    }

                }
            }
        }

    }
    // let serializer = new JSONLD_Serializer({outputFormat: 'string', compact: true});
    //
    // // forward the quads to the serializer
    // serializer.serialize(results, function(resolve){
    //     console.log(resolve)
    //                                        });
    // pipe the serializer output to stdout
    return graph;
}
function getItemByatId(list, id){
    for(let i = 0; i < list.length; i++){
        if(list[i].id === id) return list[i]
    }
}

function getItemById(list, id){
    for(let i = 0; i < list.length; i++){
        if(list[i].id === id) return list[i]
    }
}

class DataCreation extends Component {
    constructor() {
        super();
        if (this.state) {
            if (this.state.data) {
                console.error('DATA ALREADY EXISTS')
            }
        }
        this.state = {
            currentPage: 1,
            data: '',
            dataClassifications: [],
            classes: [],
            nodes: [],
            edges: [],
            processing: true,
        }
    }


    finishFirstStep(i) {
        this.setState({
            currentPage: 2,
        })
    }

    // columnName: column,
    // exampleValue: temp[1][index],
    // class: {name:'Literal'},
    // uri: false,
    // label: false

    toThirdStep() {
        console.log('clack');
        //Convert data to nodes and edges
        this.setState(
            {
                nodes: [],
                edges: []
            }
        );
        let nodes = [];
        let edges = [];
        let data = this.state.data;
        let classifications = this.state.dataClassifications.slice();
        let tempClassifications = [];
        for (let i = 0; i < classifications.length; i++) {
            let item = classifications[i];
            if (item.label) {
                nodes.push(
                    {
                        id: (nodes.length),
                        label: item.class.name,
                        type: 'literal',
                        r: 30,
                        title: item.class.name,
                        column:i,
                    });
                nodes.push(
                    {
                        id: (nodes.length),
                        label: item.class.name + '_uri',
                        type: 'uri',
                        r: 30,
                        title: item.class.name + '_uri',
                        uri: item.class.uri,
                        column:this.state.data[0].length,
                    });
                edges.push(
                    {
                        source: nodes.length - 1,
                        target: nodes.length - 2,
                        relation: 'rdfs:label',
                        r: 30,
                        type: "emptyEdge",
                        title: 'label',
                        link: 'https://www.w3.org/2000/01/rdf-schema#label'


                    }
                );
                let uniqueCounter=1;
                for(let y = 0; y< data.length; y++){
                    if(y===0){
                        data[0].push(item.class.name + '_uri');
                        continue
                    }
                    if(!data[y][i]) {
                        data[y].push('');
                        continue;
                    }
                    let copyFound =false;
                    for(let x = 0; x < y; x++) {
                        if (data[x][i]===data[y][i]) {
                            data[y].push(data[x][data[x].length-1]);
                            copyFound=true;
                            break;
                        }
                    }
                    if(!copyFound){
                        let baseUri = classifications[i].baseUri;
                        if(baseUri.startsWith("http://")||baseUri.startsWith("https://")){

                        } else if(baseUri.startsWith("www")){
                            baseUri="http://" + baseUri;
                        } else {
                            baseUri="http://www." + baseUri;
                        }
                        if(classifications[i].baseUri[classifications[i].baseUri.length-1] !=='/'){
                            baseUri=baseUri+'/';
                        }
                        data[y].push(baseUri+uniqueCounter)
                        uniqueCounter++;
                    }

                }
            } else if (item.uri) {
                nodes.push(
                    {
                        id: (nodes.length),
                        label: item.class.name,
                        type: 'uri',
                        r: 30,
                        title: item.class.name,
                        uri: item.class.uri,
                        column:i,
                    });
            } else {
                nodes.push(
                    {
                        id: (nodes.length),
                        label: item.columnName,
                        type: 'literal',
                        r: 30,
                        title: item.columnName,
                        column:i,
                    });
            }

        }

        //Distribution algorithm
        let dX = 100;
        let dY = 100;
        let rowLength = Math.ceil(Math.sqrt(nodes.length));
        for (let i = 0; i < nodes.length; i++) {
            let item = nodes[i];
            if (i % rowLength === 0 && i !== 0) {
                dX = 100;
                dY += 225;
            }
            if (!item.x) {
                item.x = dX;
                item.y = dY;
                dX += 225;
            }
        }

        this.setState({
            data:data,
            currentPage: 3,
            classes: classifications,
            nodes: nodes,
            edges: edges
        });

    }

    renderDataClassifyView() {
        if (this.state.data) {
            return (
                <DataClassifyView
                    data={this.state.dataClassifications}
                    nextPage={this.toThirdStep.bind(this)}
                    setClass={this.setClass.bind(this)}
                    setUri={this.setUri.bind(this)}
                    setLabel={this.setLabel.bind(this)}
                    setBaseUri={this.setBaseUri.bind(this)}
                />
            )
        }

    }

    getData() {
        return ({nodes: this.state.nodes, links: this.state.edges})
    }

    goBackTo(index) {
        switch (index) {
            case 2:
                this.setState({
                    nodes: [],
                    edges: [],
                    currentPage: 2
                });
                break;
            default:
                this.setState({
                    currentPage: index
                })

        }
    }

    goToFinalPage() {
        this.setState({
            currentPage: 4
        });
        transformData(this.state.data,this.state.dataClassifications,this.state.edges,this.state.nodes)
            .then(result =>{
                this.setState({
                  graph:result,
                  processing:false,
                })
            }).then(result =>{
                let d = this.serialiseData(result);
        });

    }
    serialiseData(data){

        let serializer = new JSONLD_Serializer();
        serializer.serialize(this.state.graph, function(resolve){
        }).then(result =>{
            console.log('turtle',result);
            this.setState({
                turtle:result
            });
            return result;
        })

    }
    setData(data) {
        let exampleValues;
        if (data.length > 1) {
            exampleValues = data[0].map(function (column, index) {
                return {
                    columnName: column,
                    exampleValue: data[1][index],
                    class: {name: 'Literal'},
                    uri: false,
                    label: false
                }
            })
        } else {
            exampleValues = {}
        }
        this.setState({
            data: data,
            dataClassifications: exampleValues
        })
    }

    setUri(index, boolean) {
        let dataClasses = this.state.dataClassifications.slice();
        let item = dataClasses[index];
        if (item.label) {
            item.label = false;
            item.baseUri = null;
        }
        item.uri = boolean;
        item.class={name:'Literal'};
        dataClasses[index] = item;
        this.setState({
            dataClassifications: dataClasses
        })

    }

    setLabel(index, boolean) {
        let dataClasses = this.state.dataClassifications.slice();
        let item = dataClasses[index];
        item.label = boolean;
        dataClasses[index] = item;
        if(!boolean){
            item.baseUri = null;
        }
        this.setState({
            dataClassifications: dataClasses
        })
    }

    setClass(index, classification) {
        let dataClasses = this.state.dataClassifications.slice();
        let item = dataClasses[index];
        item.class = classification;
        dataClasses[index] = item;
        this.setState({
            dataClassifications: dataClasses
        })

    }

    setBaseUri(index, classification) {
        let classes = this.state.dataClassifications.slice();
        let item = classes[index];
        item.baseUri = classification;
        classes[index] = item;
        this.setState({
            dataClassifications: classes
        })


    }

    setActiveNode(index, node) {
        let nodes = this.state.nodes.slice();
        nodes[index] = node;
        this.setState({
            nodes: nodes,
        })
    }

    pushEdge(newEdge) {
        let links = this.state.edges.slice();
        links.push(newEdge);
        this.setState({
                edges: links,
            }
        );

    }

    deleteEdge(index, edge) {
        const edges = this.state.edges;
        edges.splice(index, 1);
        this.setState({links: edges});

    }

    renderDataLink() {
        if (this.state.nodes) {
            return (
                <DataLinkView
                    nodes={this.state.nodes}
                    links={this.state.edges}
                    getData={this.getData.bind(this)}
                    nextPage={this.goToFinalPage.bind(this)}
                    previousPage={this.goBackTo.bind(this)}
                    setNode={this.setActiveNode.bind(this)}
                    pushEdge={this.pushEdge.bind(this)}
                    deleteEdge={this.deleteEdge.bind(this)}
                />
            )
        }
    }

    render() {
        return (
            <Tabs value={this.state.currentPage}>
                <Tab label="Step 1: Create Data" value={1} disabled>
                    <DataImport data={this.state.data} pageFunction={this.finishFirstStep.bind(this)}
                                setData={this.setData.bind(this)}/>
                </Tab>
                <Tab label="Step 2: Classify Data" value={2} disabled>
                    {this.renderDataClassifyView()}
                </Tab>
                <Tab label="Step 3: Link Data" value={3} disabled>
                    {this.renderDataLink()}
                </Tab>
                <Tab label="Step 4: Finished" value={4} disabled>
                    <DownloadView processing={this.state.processing} graph={this.state.graph}/>
                </Tab>

            </Tabs>)
    }


}

export default DataCreation;
