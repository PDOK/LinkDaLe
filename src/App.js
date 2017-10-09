import React, { Component } from 'react';
import { SparqlClient } from 'sparql-client-2';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MaterialDrawer from 'material-ui/Drawer/Drawer';
import Card from 'material-ui/Card/Card';
// import CardHeader from 'material-ui/Card/CardHeader';
import CardText from 'material-ui/Card/CardText';
import AppBar from 'material-ui/AppBar/';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SparqlJs from 'sparqljs';
import Markdown from 'react-markdown';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Create from 'material-ui/svg-icons/content/create';
import Explore from 'material-ui/svg-icons/action/explore';
import LightBulb from 'material-ui/svg-icons/action/lightbulb-outline';
import Info from 'material-ui/svg-icons/action/info';
import { List, ListItem } from 'material-ui/List';

import {
  green400,
  green500,
  green700,
  orangeA200,
} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import './App.css';
import DataCreation from './DataCreation';
import Tutorialised from './Tutorialised';
import DataBrowser from './DataBrowser';
import QueryWriter from './QueryWriter';

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
  },
});
const States = {
  Welcome: 1,
  DataCreation: 2,
  DataBrowsing: 3,
  Querying: 4,
  Tutorialise: 5,
  AboutTool: 6,
  AboutLD: 7,
  AboutLODC: 9,
  AboutLOV: 10,
};

function NavigationBar(props) {
  return (
    <MaterialDrawer>
      <Card className="home_card" onClick={() => props.onClick(States.Welcome)}>
        <CardText>
          <img src={`${process.env.PUBLIC_URL}/images/linkdale_logo.png`} height={80} alt="logo" />
          <p>Linked Data Learning Environment </p>
        </CardText>
      </Card>
      <div style={{ textAlign: 'left' }}>
        <List>
          <ListItem
            primaryText={'Create Linked Data'}
            onClick={() => props.onClick(States.DataCreation)}
            leftIcon={<Create />}
          />
          <ListItem
            primaryText={'Browse Data'}
            onClick={() => props.onClick(States.DataBrowsing)}
            leftIcon={<Explore />}
          />
          <ListItem
            primaryText={'Query Data'}
            onClick={() => props.onClick(States.Querying)}
            leftIcon={<Play />}
          />
          <ListItem
            primaryText={'Tutorial'}
            onClick={() => props.onClick(States.Tutorialise)}
            leftIcon={<LightBulb />}
          />
          <Divider />
          <ListItem
            primaryTogglesNestedList
            primaryText={'About'}
            leftIcon={<Info />}
            nestedItems={[
              <ListItem
                primaryText={'The tool'}
                onClick={() => props.onClick(States.AboutTool)}

              />,
              <ListItem
                primaryText={'Linked Data'}
                onClick={() => props.onClick(States.AboutLD)}
              />,
              <ListItem
                primaryText={'Linked Open Data Cloud'}
                onClick={() => props.onClick(States.AboutLODC)}
              />,
            ]}
          />
        </List>
        <Divider />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',

        }}
      >
        <Divider />
        <IconButton
          iconClassName="muidocs-icon-custom-github"
          href="https://github.com/PDOK/LinkDaLe"
          rel="noopener noreferrer"
        />
      </div>
    </MaterialDrawer>
  );
}

NavigationBar.propTypes = {
  onClick: PropTypes.func.isRequired,
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      state: States.Welcome,
      title: 'Welcome',
      client: new SparqlClient('http://almere.pilod.nl/sparql'),
      parser: new SparqlJs.Parser(),
    };
  }
  executeSparql = (call, callBack) => {
    console.info('call', call);
    try {
      this.state.parser.parse(call);
      this.state.client.query(call).execute((err, results) => {
        if (err) {
          if (callBack) {
            callBack(err, []);
          }
        } else if (callBack) {
          console.info('results', results);
          callBack('', results.results.bindings);
        }
      });
    } catch (error) {
      callBack(error, null);
    }
  };

  handleClick = (i) => {
    let title;
    let link = '';
    if (this.state === i) {
      return;
    }
    switch (i) {
      case (States.Welcome) :
        title = 'Welcome';
        break;
      case (States.DataCreation):
        title = 'Create Linked Data';
        break;
      case (States.DataBrowsing):
        title = 'Browse data';
        break;
      case (States.Querying):
        title = 'Query data';
        break;
      case (States.Tutorialise):
        title = 'Tutorials';
        break;
      case (States.AboutTool):
        title = 'About the tool';
        link = `${process.env.PUBLIC_URL}/markdown/AboutTool.MD`;
        break;
      case (States.AboutLD):
        title = 'About Linked Data';
        link = `${process.env.PUBLIC_URL}/markdown/AboutLD.MD`;
        break;
      case (States.AboutLODC):
        title = 'About Linked Open Data Cloud';
        link = `${process.env.PUBLIC_URL}/markdown/AboutLOD.MD`;
        break;
      case (States.AboutLOV):
        // title = 'About Linked Open Vocabulary';
        // link = `${process.env.PUBLIC_URL}/markdown/AboutTool.MD`;
        break;
      default:
        title = 'Welcome';
    }
    if (link) {
      fetch(link).then(
        result => result.text()).then(
        body => this.setState({
          markdownText: body,
        }),
      );
    }
    this.setState({
      state: i,
      title,
    });
  };


  renderContent = () => {
    switch (this.state.state) {
      case States.DataCreation:
        return <DataCreation executeQuery={this.executeSparql} />;
      case States.DataBrowsing:
        return <DataBrowser executeQuery={this.executeSparql} />;
      case States.Querying:
        return (<QueryWriter
          executeQuery={this.executeSparql}
        />);
      case States.Tutorialise:
        return <Tutorialised />;
      // case States.AboutLOV:
      case States.AboutLODC:
      case States.AboutTool:
      case States.AboutLD:

        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <space style={{ flex: 1 }} />
            <div style={{ textStyle: 'roboto, sans-serif', textAlign: 'left', flex: 3, width: '60%' }}>
              <Markdown source={this.state.markdownText} />
            </div>
            <space style={{ flex: 1 }} />
          </div>
        );
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <space style={{ flex: 1 }} />
            <div style={{ textStyle: 'roboto, sans-serif', textAlign: 'left', flex: 3, width: '50%' }}>
              <h1 style={{ textAlign: 'center' }}>LinkDaLe</h1>
              <Markdown source={'is a learning environment where people can learn ' +
             'basics of Linked Data and WEB of Data. It was created to help people with ' +
              'limited IT skills to start thinking in graphs. \n\n' +
              'If you have no idea what Linked Data is, start with *About* pages.' +
              'If you have some knowledge read  *Getting started* tutorials first to learn the interface.\n\n' +
              'In any case you can start right now!' +
              ''}
              />
              <img src={`${process.env.PUBLIC_URL}/images/tut1.png`} alt="LinkDaLe" style={{ width: '100%' }} />
            </div>
            <space style={{ flex: 1 }} />
          </div>

        );
    }
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <NavigationBar
            onClick={i => this.handleClick(i)}
          />
          <div style={{ paddingLeft: 256 }}>
            <AppBar
              title={this.state.title}
              showMenuIconButton={false}
              // iconClassNameRight="muidocs-icon-navigation-expand-more"
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
