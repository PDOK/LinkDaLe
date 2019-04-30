/* eslint-disable react/jsx-no-bind,react/jsx-filename-extension */
/**
 * Created by theli on 8/9/2017.
 */
import 'whatwg-fetch';
import React from 'react';
import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText,
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Markdown from 'react-markdown';
import './Tutorialised.css';

function ImageRenderer(props) {
  // eslint-disable-next-line alt prop provided by React Markdown renderer
  return <img {...props} style={{maxWidth:'100%'}}/>
}

class Tutorialised extends React.Component {
  constructor() {
    super();
    this.state = {
      markdownText: '#NO MARKDOWN LOADED',
      dialogOpen: false,
      tutorials:
      {
        1: {
          expanded: false,
          markdownURIs:
          [
            `${process.env.PUBLIC_URL}/markdown/myFirstLD.MD`,
            `${process.env.PUBLIC_URL}/markdown/BrowseLD.MD`,
            `${process.env.PUBLIC_URL}/markdown/QueryLD.MD`,
            `${process.env.PUBLIC_URL}/markdown/EnrichLD.MD`,
          ],
        },
        2: {
          expanded: false,
          markdownURIs:
          [
            `${process.env.PUBLIC_URL}/markdown/AboutBPIL.MD`,
            `${process.env.PUBLIC_URL}/markdown/BPIL1.MD`,
            `${process.env.PUBLIC_URL}/markdown/BPIL2.MD`,
            `${process.env.PUBLIC_URL}/markdown/BPIL3.MD`,
            `${process.env.PUBLIC_URL}/markdown/BPIL4.MD`,
          ],
        },
        3: {
          expanded: false,
          markdownURIs:
          [
           `${process.env.PUBLIC_URL}/markdown/GLD_1.MD`,
           `${process.env.PUBLIC_URL}/markdown/GLD_2.MD`,
           `${process.env.PUBLIC_URL}/markdown/GLD_3.MD`,
          ],
        }
      },
    };
  }

  handleClose() {
    this.setState({ dialogOpen: false });
  }

  openRemoteMarkdown(id, markdownId) {
    fetch(this.state.tutorials[id].markdownURIs[markdownId]).then(
      result => result.text()).then(
      body => this.setState({
        markdownText: body,
        dialogOpen: true,
      }),
    );
  }
  expandCollapseCard(id) {
    const tutorals = this.state.tutorials;
    tutorals[id].expanded = !this.state.tutorials[id].expanded;
    this.setState({ tutorials: tutorals });
  }

  render() {
    const cardActions = [
      <FlatButton
        label="Close"
        primary
        onClick={this.handleClose.bind(this)}
      />,
    ];
    return (
      <div className="TutorialWrapper">
          {/*<Grid container spacing={24}>*/}
              {/*<Grid item xs={12}>*/}
                  <Card className="TutorialCard"
                        expanded={this.state.tutorials[1].expanded}>
                      <CardMedia className="clickable_surface" onClick={() => this.expandCollapseCard(1)}>
                          <img src={`${process.env.PUBLIC_URL}/images/tut1.png`} alt="Getting Started" />
                      </CardMedia>
                      <CardTitle className="clickable_surface"
                                 title="Getting Started"
                                 subtitle="Learn Linked Data"
                                 onClick={() => this.expandCollapseCard(1)}/>
                      <CardText className="TutorialCardText clickable_surface"
                                onClick={() => this.expandCollapseCard(1)}
                                expandable>
                          <strong>Linked Data</strong> is a method of publishing structured data so that it
                          can be linked and queried.  With this tutorial you will learn the basics of the Linked Data
                          technology and will generate your first Linked Data.
                      </CardText>
                      <CardActions expandable>
                          <FlatButton label="Tutorial: Create Linked Data"
                                      onClick={() => this.openRemoteMarkdown(1, 0)}/>
                          <FlatButton
                              label="Tutorial: Browse Data"
                              onClick={() => this.openRemoteMarkdown(1, 1)}/>
                          <FlatButton
                              label="Tutorial: Query Data"
                              onClick={() => this.openRemoteMarkdown(1, 2)}/>
                      </CardActions>
                  </Card>
              {/*</Grid>*/}
              {/*<Grid item xs={6}>*/}
                  <Card
                      className="TutorialCard"
                      expanded={this.state.tutorials[2].expanded}>
                      <CardMedia
                          className="clickable_surface"
                          onClick={() => this.expandCollapseCard(2)}
                          style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                          <img className="clickable_surface"
                               src={`${process.env.PUBLIC_URL}/images/bpil.png`}
                               alt="Business Process Integration Lab" />
                      </CardMedia>
                      <CardTitle
                          className="clickable_surface"
                          onClick={() => this.expandCollapseCard(2)}
                      title="Business Process Integration Lab"
                          subtitle="Linked Data for Supply-chain integration"
                          actAsExpander/>
                      <CardText
                          className="TutorialCardText clickable_surface"
                          onClick={() => this.expandCollapseCard(2)}
                          expandable>
                          <strong> BPIL </strong> is a course at University of Twente where students
                          learn how to build and integrate systems between different parties in a supply chain.
                          Linked Data is a technology that helps to simplify
                          data management and exchange between parties.
                      </CardText>
                      <CardActions expandable>
                          <FlatButton
                              label="About BPIL"
                              onClick={() => this.openRemoteMarkdown(2, 0)}/>
                          <FlatButton
                              label="Assignment 1: Explain Yourself"
                              onClick={() => this.openRemoteMarkdown(2, 1)}/>
                          <FlatButton
                              label="Assignment 2: Enrich It"
                              onClick={() => this.openRemoteMarkdown(2, 2)}/>
                          <FlatButton
                              label="Assignment 3: Find your match"
                              onClick={() => this.openRemoteMarkdown(2, 3)}/>
                          <FlatButton
                              label="Assignment 4: Call mister Postman"
                              onClick={() => this.openRemoteMarkdown(2, 4)}/>
                      </CardActions>
                  </Card>
              {/*</Grid>*/}
              {/*<Grid item xs={6}>*/}
                  <Card
                      className="TutorialCard"
                      expanded={this.state.tutorials[3].expanded}>
                      <CardMedia
                          className="clickable_surface"
                          onClick={() => this.expandCollapseCard(3)}
                          style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                          <img className="clickable_surface"
                               src={`${process.env.PUBLIC_URL}/images/gld3.png`}
                               alt="Geospatial Linked Data" />
                      </CardMedia>
                      <CardTitle
                          className="clickable_surface"
                          onClick={() => this.expandCollapseCard(3)}
                          title="Geospatial Linked Data"
                          subtitle="Location information as Linked data"
                          actAsExpander/>
                      <CardText
                          className="TutorialCardText clickable_surface"
                          onClick={() => this.expandCollapseCard(3)}
                          expandable>
                          Space is a fundamental source of contextual information and therefore,
                          it allows linking data instances that are semantically disjoint on
                          ontological level. <strong> Geospatial Linked Data </strong> is a tutorial about
                          the use and role of location information in Linked Data.
                      </CardText>
                      <CardActions expandable>
                          <FlatButton
                              label="Tutorial: Geospatial Linked Data"
                              onClick={() => this.openRemoteMarkdown(3, 0)}/>
                          <FlatButton
                              label="Assignment 1: Make your geo data"
                              onClick={() => this.openRemoteMarkdown(3, 1)}/>
                          <FlatButton
                              label="Assignment 2: Query it across space and time"
                              onClick={() => this.openRemoteMarkdown(3, 3)}/>
                      </CardActions>
                  </Card>
              {/*</Grid>*/}
          {/*</Grid>*/}
        <Dialog
          open={this.state.dialogOpen}
          autoScrollBodyContent
          onRequestClose={this.handleClose.bind(this)}
          modal={false}
          actions={cardActions}
          contentStyle={{width:"80%", maxWidth:"none"}}
        >
          <Markdown source={this.state.markdownText}
          renderers={{image:ImageRenderer}}
           />
        </Dialog>


      </div>
    );
  }
}

export default Tutorialised;
