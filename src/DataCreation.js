/**
 * Created by Gerwin Bosch on 30-6-2017.
 */
import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import DataImport from './DataImport'
import DataClassifyView from './DataClassifyView'
import DataLinkView from './DataLinkView'

const States = {
    DataUpload: 11,
    DataClassifying: 12,
    DataLinking: 13,
    DataPublishing: 14,
};
let id = 0;

class DataCreation extends Component {
    constructor() {
        super();
        if(this.state){
            if(this.state.data) {
                console.error('DATA ALREADY EXISTS')
            }
        }
        this.state = {
            currentPage: 1,
            data: '',
            dataClassifications:[],
            classes:{},
            nodes:[],
            edges:[],
        }
    }


    finishFirstStep(i) {
        this.setState({
            currentPage: 2,
        })
    }
    loadSecondaryData(){
        if(this.state.data){
            return this.state.data.slice(0,2);
        } else {
            return [[]]
        }

    }

    // columnName: column,
    // exampleValue: temp[1][index],
    // class: {name:'Literal'},
    // uri: false,
    // label: false

    toThirdStep(){
        console.log('clack');
        //Convert data to nodes and edges
        this.setState(
            {
                nodes:[],
                edges:[]
            }
        )
        let nodes = [];
        let edges = [];
        let classifications = this.state.dataClassifications.slice();
        for(let i = 0; i < classifications.length;i++){
            let item = classifications[i];
            if(item.label){
                nodes.push(
                    {
                        id:(nodes.length),
                        label:item.class.name,
                        type:'literal',
                        r:30,
                        title:item.class.name,
                        class:item.class.uri
                    });
                //TODO: Create uri's
                nodes.push(
                    {
                        id:(nodes.length),
                        label:item.class.name+'_id',
                        type:'uri',
                        r:30,
                        title:item.class.name+'_id',
                        class:item.class
                    });
                edges.push(
                    {
                        source:nodes.length-1,
                        target:nodes.length-2,
                        relation:'rdfs:label',
                        r:30,
                        type: "emptyEdge",
                        title:'label',
                        link:'https://www.infowebml.ws/rdf-owl/label.htm'


                    }

                )
            } else if (item.uri){
                nodes.push(
                    {
                        id:(nodes.length),
                        label:item.class.name,
                        type:'uri',
                        r:30,
                        title:item.class.name

                    });
            } else {
                nodes.push(
                    {
                        id:(nodes.length),
                        label:item.columnName,
                        type:'literal',
                        r:30,
                        title:item.columnName

                    });
            }

        }
        //Distribution algorithm
        let dX = 100;
        let dY = 100;
        let rowLength = Math.ceil(Math.sqrt(nodes.length));
        for(let i = 0; i<nodes.length;i++){
            let item  = nodes[i];
            if(i%rowLength === 0 && i !== 0){
                dX= 100;
                dY += 225;
            }
            if(!item.x){
                item.x = dX;
                item.y = dY;
                dX += 225;
            }
        }


        this.setState({
            currentPage: 3,
            classes: classifications,
            nodes:nodes,
            edges:edges
        });

    }
    renderDataClassifyView() {
        if(this.state.data){
            return (
                <DataClassifyView
                    data={this.state.dataClassifications}
                    nextPage={this.toThirdStep.bind(this)}
                    setClass={this.setClass.bind(this)}
                    setUri={this.setUri.bind(this)}
                    setLabel={this.setLabel.bind(this)}
                />
            )
        }

    }
    getData(){
        return ({nodes:this.state.nodes,links:this.state.edges})
    }
    goBackTo(index){
        switch (index) {
            case 2:
                this.setState({
                    nodes:[],
                    edges:[],
                    currentPage:2
                });
                break;
            default:
            this.setState({
                currentPage:index
            })

        }
    }
    goToFinalPage(){
        this.setState({
            currentPage:4
        })
    }
    setData(data){
        let exampleValues;
        if(data.length > 1) {
                exampleValues= data[0].map(function(column,index) {
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
            data:data,
            dataClassifications:exampleValues
        })
    }
    setUri(index, boolean){
        let dataClasses = this.state.dataClassifications.slice();
        let item = dataClasses[index];
        if(item.label){
            item.label=false;
        }
        item.uri = boolean;
        dataClasses[index]=item;
        this.setState({
            exampleValues:dataClasses
        })

    }
    setLabel(index, boolean){
        let dataClasses = this.state.dataClassifications.slice();
        let item = dataClasses[index];
        item.label = boolean;
        dataClasses[index]=item;
        this.setState({
            exampleValues:dataClasses
        })
    }
    setClass(index, classfication){
        let dataClasses = this.state.dataClassifications.slice();
        let item = dataClasses[index];
        item.class = classfication;
        dataClasses[index]=item;
        this.setState({
            exampleValues:dataClasses
        })

    }
    setActiveNode(index,node){
        let nodes = this.state.nodes.slice()
        nodes[index] = node;
        this.setState({
            nodes:nodes,
        })
    }
    pushEdge(newEdge){
        let links = this.state.edges.slice();
        links.push(newEdge);
        this.setState({
                edges:links,
            }
        );

    }
    deleteEdge(index, edge){
        const edges = this.state.edges;
        edges.splice(index, 1);
        this.setState({links: edges});

    }

    renderDataLink(){
        console.log('renderData', this.state.nodes);
        if(this.state.nodes){
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
                    <DataImport data={this.state.data} pageFunction={this.finishFirstStep.bind(this)} setData={this.setData.bind(this)}/>
                </Tab>
                <Tab label="Step 2: Classify Data" value={2} disabled>
                    {this.renderDataClassifyView()}
                </Tab>
                <Tab label="Step 3: Link Data" value={3} disabled>
                    {this.renderDataLink()}
                </Tab>
                <Tab label="Step 4: Finished" value={4} disabled>
                </Tab>

            </Tabs>)
    }


}
export default DataCreation;
