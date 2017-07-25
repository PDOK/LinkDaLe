import React, {Component} from 'react';
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
class InfoBar extends Component {
    constructor(){
        super();
    }
    renderProgress(){
        if(this.props.processing){
            return(
                <CircularProgress
                    style={{
                        margin: 'auto',
                        position:'absolute',
                        top:'50%',
                        left:'50%',
                        transform: 'translate(-50%,-50%)'
                    }}
                    size={100}
                />
            )
        }
    }
    renderTurtle(){
        console.log(this.props.turtle)
        if(!this.props.turtle){
            return <p>Generating turtle</p>
        } else {
            console.log(this.props.turtle.split('\n'));
            return(
            <div>
                {this.props.turtle.split('\n').map((text)=>
              <p>{text}</p>
            )}
            </div>
            )
        }
    }
    handleDownloadClick(){
        let dataStr = "data:application/x-turtle;charset=utf-8," + encodeURIComponent(this.props.turtle);
        let dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "dataSet.turtle");
        dlAnchorElem.click();
    }

    render(){
        return(
            <div style={{position:'relative', width:'100%',minHeight:'100%', height:'100%'}}>
                <Paper>
                    <div style={{width:'100%%' }}>
                        <div style={{width:'100%'}}>
                            <RaisedButton
                                label='download'
                                onClick={()=>this.handleDownloadClick()}
                                disabled={this.props.processing}
                                style={{
                                    margin:'30px',
                                    width:'40%',
                                    float:'left'

                                }}
                            />
                        </div>
                        <div style={{width:'100%'}}>
                        <RaisedButton
                            label='publish'
                            disabled={true}
                            style={{
                                margin:'30px',
                                width:'40%',
                                float:'right'

                            }}
                        />
                        </div>

                    </div>
                    <div style={
                        {
                            paddingTop:'90px',
                            minHeight:'700px',
                            paddingLeft:'50px'
                        }
                    }>
                        {this.renderTurtle()}
                        {this.renderProgress()}
                        <p>
                        </p>
                    </div>

                </Paper>
            </div>
        )
    }
}
export default InfoBar