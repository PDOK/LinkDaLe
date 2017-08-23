/**
 * Created by theli on 8/9/2017.
 */
import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './Tutorialised.css'
class Tutorialised extends React.Component {
    constructor(){
        super()
        this.state={
            tut1:{
                expanded:false
            },
            tut2:{
                expanded:false
            }
        }
    }

render(){
    return (
        <div className="TutorialWrapper">
        <Card className="TutorialCard" expanded={this.state.tut1.expanded} onClick={() => this.setState({tut1:{expanded:!this.state.tut1.expanded}})}>
            <CardMedia style={{width:'90%',  marginLeft:'auto', marginRight:'auto'}} >
                <img  src={process.env.PUBLIC_URL + '/images/tut1.png'}  />
            </CardMedia>
            <CardTitle title="Getting Started" subtitle="Learn Linked Data"/>
            <CardText expandable>
                Linked Data is a method of publishing structured data so that it can be linked and queried.
                With this tutorial you will learn the basics of the Linked Data technology and will generate your first Linked Data.
            </CardText >
            <CardActions expandable>
                <FlatButton label="About the tool" />
                <FlatButton label="About Linked Data" />
                <FlatButton label="Exercise: My first Linked Data" />
            </CardActions>
        </Card>
            <Card className="TutorialCard" expanded={this.state.tut2.expanded} onClick={() => this.setState({tut2:{expanded:!this.state.tut2.expanded}})}>
                <CardMedia style={{width:'90%',  marginLeft:'auto', marginRight:'auto'}}>
                    <img  src={process.env.PUBLIC_URL + '/images/bpil.png'}  />
                </CardMedia>
                <CardTitle title="Business Process Integration Lab" subtitle="Linked Data for Supply-chain integration"  actAsExpander={true} />
                <CardText expandable>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                    Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                    Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                </CardText >
                <CardActions expandable>
                    <FlatButton label="Exercise 1: Unicorn Trade" />
                    <FlatButton label="Exercise 2" />
                </CardActions>
            </Card>
            <Card className="TutorialCard" expanded={this.state.tut1.expanded} onClick={() => this.setState({tut1:{expanded:!this.state.tut1.expanded}})}>
                <CardMedia style={{width:'90%',  marginLeft:'auto', marginRight:'auto'}} >
                    <img  src={process.env.PUBLIC_URL + '/images/tut1.png'}  />
                </CardMedia>
                <CardTitle title="Getting Started" subtitle="Learn Linked Data"/>
                <CardText expandable>
                    Linked Data is a method of publishing structured data so that it can be linked and queried.
                    With this tutorial you will learn the basics of the Linked Data technology and will generate your first Linked Data.
                </CardText >
                <CardActions expandable>
                    <FlatButton label="About the tool" />
                    <FlatButton label="About Linked Data" />
                    <FlatButton label="Exercise: My first Linked Data" />
                </CardActions>
            </Card>
            <Card className="TutorialCard" expanded={this.state.tut2.expanded} onClick={() => this.setState({tut2:{expanded:!this.state.tut2.expanded}})}>
                <CardMedia style={{width:'90%',  marginLeft:'auto', marginRight:'auto'}}>
                    <img  src={process.env.PUBLIC_URL + '/images/bpil.png'}  />
                </CardMedia>
                <CardTitle title="Business Process Integration Lab" subtitle="Linked Data for Supply-chain integration"  actAsExpander={true} />
                <CardText expandable>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                    Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                    Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                </CardText >
                <CardActions expandable>
                    <FlatButton label="Exercise 1: Unicorn Trade" />
                    <FlatButton label="Exercise 2" />
                </CardActions>
            </Card>

        </div>
    )
}

}

export default Tutorialised