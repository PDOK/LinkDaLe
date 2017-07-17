import React, {Component} from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MaterialDrawer from 'material-ui/Drawer/Drawer'
import Card from 'material-ui/Card/Card'
import CardHeader from 'material-ui/Card/CardHeader'
import CardText from 'material-ui/Card/CardText'
import FlatButton from 'material-ui/FlatButton/'
import AppBar from 'material-ui/AppBar/'
import DataCreation from './DataCreation'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {green500,green700,green400, orangeA200} from 'material-ui/styles/colors'
// import {MdCode,MdSearch,MdCreate,MdBook} from 'react-icons/md';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
const muiTheme = getMuiTheme({
    palette: {
        primary1Color: green500,
        primary2Color: green700,
        primary3Color: green400,
        accent1Color: orangeA200,
    }
});


class NavigationBar extends Component {
    render() {
        return (
            <MaterialDrawer>
                <Card>
                    <CardHeader>
                        RDF-PAQT
                    </CardHeader>
                    <CardText>
                        RDF-PAQT is a service which will help you create a semantic rich RDF data set from a csv file
                    </CardText>
                </Card>
                <FlatButton
                    label="Create Linked Data"
                    fullWidth={true}
                    onClick={() => this.props.onClick(States.DataCreation)}
                />
                <FlatButton
                    label="Browse Data"
                    fullWidth={true}
                    onClick={() => this.props.onClick(States.DataBrowsing)}
                />
                <FlatButton
                    label="Query Data"
                    fullWidth={true}
                    onClick={() => this.props.onClick(States.Querying)}
                />
                <FlatButton
                    label="Query Data"
                    fullWidth={true}
                    onClick={() => this.props.onClick(States.Tutorialise)}
                />

            </MaterialDrawer>
        )
    }
}
const States = {
    Welcome:1,
    DataCreation:2,
    DataBrowsing:3,
    Querying:4,
    Tutorialise:5
};

class App extends Component {
    constructor() {
        super();
        this.state = {
            state : States.Welcome,
            title:'Welcome'
        }
    }
    renderContent(){
        switch(this.state.state){
            case States.Welcome:
                return <h1>Welcome</h1>;
            case States.DataCreation:
                return <DataCreation/>;
            case States.DataBrowsing:
                return <h1>WIP</h1>;
            case States.Querying:
                return <h1>WIP</h1>;
            case States.Tutorialise:
                return <h1>WIP</h1>
        }
    }
    handleClick(i){
        console.log(i);
        let title;
        if(this.state === i){
            return
        }
        switch(i){
            case (States.Welcome) :
                title = "Welcome";
                break;
            case (States.DataCreation):
                title = "Create Linked Data";
                break;
            case (States.DataBrowsing):
                title = "Browse data";
                break;
            case (States.Querying):
                title = "Query data";
                break;
            case (States.Tutorialise):
                title = "Learn about Linked Data";
                break;
        }
        this.setState({
            state : i,
            title : title,
        })
    }



    render() {

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="App">
                    <NavigationBar
                        onClick={(i) => this.handleClick(i)}
                    />
                    <div style={{paddingLeft:256}}>
                        <AppBar
                            title={this.state.title}
                            iconClassNameRight="muidocs-icon-navigation-expand-more"
                        />
                        {
                        this.renderContent()
                    }
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
