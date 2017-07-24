/**
 * Created by Gerwin Bosch on 30-6-2017.
 */
import React, {Component} from 'react';
import {Tab, Tabs} from 'material-ui/Tabs';
import DataImport from './DataImport'
import DataClassifyView from './DataClassifyView'
import DataLinkView from './DataLinkView'
import DownloadView from './DownloadView'

const States = {
    DataUpload: 11,
    DataClassifying: 12,
    DataLinking: 13,
    DataPublishing: 14,
};
async function transformData(data, classes, links, nodes){
    return await convertData(data, classes, links, nodes)
}

function convertData(data, classes, links, nodes){
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
    let results = [];
    console.log(classDefinitions);
    //For every row of data except the header
    for(let k = 1; k <data.length; k++){
        let dataRow = data[k];
        console.log(dataRow);
        //Check if the uri is in that label
        for(let id = 0; id < classDefinitions.length; id++){
            let cd = classDefinitions[id];
            //Skip when the value is not present in the data
            if(!dataRow[cd.subject.column]) continue;
            //Skip when there are no relations
            if(cd.relations.length===0) continue;
            // Check if the item exists or a new needs to be created
            let item;
            let itemClass = classes[cd.subject.column];
            for(let civ = 0; civ < results.length; civ++){
                let res = results[civ];
                if(res['@id'] === dataRow[cd.subject.column] && res['@type'] === cd.subject.title){
                    item=res;
                }
                // else if(typeof itemClass.baseUri!== 'undefined' && res['@type'] === cd.subject.title && res.label === dataRow[cd.subject.column]){
                //     item=res;
                // }
            }
            //If there is no item create a new one
            if(!item){
                item={};
                item['@context']={};
                item['@context'][cd.subject.title] = cd.subject.uri;
                item['@type']=cd.subject.label;
                // if(itemClass.baseUri){
                //     let counter = 1;
                //     for(let civ = 0; civ < results.length; civ++){
                //         let res = results[civ];
                //         if(res['@context']['@type'] ===cd.subject.title){
                //             counter++;
                //         }
                //     }
                //     if(itemClass.baseUri[-1]==='/') {
                //         item['@id'] = itemClass.baseUri + counter;
                //     } else {
                //         item['@id'] = itemClass.baseUri + '/'+ counter;
                //     }
                // } else {
                    item['@id']=dataRow[cd.subject.column];
                // }
                cd.relations.map((x)=>{
                    if(x.target === 'literal'){
                        item['@context'][x.relation.title]=x.relation.link;
                    } else {
                        item['@context'][x.relation.title]={};
                        item['@context'][x.relation.title]['@id']=x.relation.link;
                        item['@context'][x.relation.title]['@type']='@id'
                    }
                })
            }
            console.log(cd.relations.length)
            //For every relation check if there is a value
            for(let relCounter=0; relCounter<cd.relations.length; relCounter++){
                let relation = cd.relations[relCounter];
                //If there is a relation
                console.log(relation)
                if(dataRow[relation.target.column]) {
                    //The target value
                    let targetValue = dataRow[relation.target.column]
                    //If the relation is not mentioned yet
                    console.log(targetValue)
                    if(typeof item[relation.relation.title] === 'undefined'){
                        item[relation.relation.title]=dataRow[relation.target.column];
                        //If the relation already has multiple relations
                    } else if (item[relation.relation.title] instanceof Array){
                        let cont=false;
                        //Check if the value already exists
                        for(let temp in item[relation.relation.title]){
                            if(temp === dataRow[relation.target.column]) cont = true;
                        }
                        if(!cont) {
                            item[relation.relation.title].push(dataRow[relation.target.column]);
                        }
                    } else {
                        //Check if the value is the same as projected
                        if(item[relation.relation.title] !== dataRow[relation.target.column]) {
                            item[relation.relation.title] = [item[relation.relation.title], dataRow[relation.target.column]];
                        }
                    }
                }
            }
            // Check if the item exists
            let found = false;
            for(let civ = 0; civ < results.length; civ++){
                let res = results[civ];
                if(res['@id'] === dataRow[cd.subject.column] && res['@type'] === cd.subject.title){
                    // If found replace the item
                    results[civ]=item;
                    found= true;
                    break;
                }
                // if(typeof itemClass.baseUri!== 'undefined' && res['@type'] === cd.subject.title && res.label === dataRow[cd.subject.column]){
                //     // If found replace the item
                //     results[civ]=item;
                //     found= true;
                //     break;
                // }
            }
            if(!found){
                results.push(item)
            }

        }

    }
    console.log('result',results);
    return results;
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
        let data = this.state.data
        let classifications = this.state.dataClassifications.slice();
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
                        link: 'https://www.infowebml.ws/rdf-owl/label.htm'


                    }
                );
                let uniqueCounter=1;
                for(let y = 0; y< data.length; y++){
                    if(y===0){
                        data[0].push(item.class.name + '_uri');
                        continue
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
                        if(classifications[i].baseUri[classifications[i].baseUri.length-1] ==='/'){
                            data[y].push(classifications[i].baseUri+'/'+uniqueCounter)
                        } else {
                            data[y].push(classifications[i].baseUri+'/'+uniqueCounter)
                        }
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
        console.log(classifications);

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
                  jsonLd:result,
                  processing:false,
                })
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
        }
        item.uri = boolean;
        dataClasses[index] = item;
        this.setState({
            exampleValues: dataClasses
        })

    }

    setLabel(index, boolean) {
        let dataClasses = this.state.dataClassifications.slice();
        let item = dataClasses[index];
        item.label = boolean;
        dataClasses[index] = item;
        this.setState({
            exampleValues: dataClasses
        })
    }

    setClass(index, classification) {
        let dataClasses = this.state.dataClassifications.slice();
        let item = dataClasses[index];
        item.class = classification;
        dataClasses[index] = item;
        this.setState({
            exampleValues: dataClasses
        })

    }

    setBaseUri(index, classification) {
        console.log(index);
        console.log(classification)
        let classes = this.state.dataClassifications.slice();
        console.log(classes)
        let item = classes[index];
        console.log(item)
        item.baseUri = classification;
        classes[index] = item;
        this.setState({
            exampleValues: classes
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
                    <DownloadView processing={this.state.processing}/>
                </Tab>

            </Tabs>)
    }


}

export default DataCreation;
